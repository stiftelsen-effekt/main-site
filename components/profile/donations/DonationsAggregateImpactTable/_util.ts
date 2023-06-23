import { Distribution, Donation, GiveWellGrant, ImpactEvaluation } from "../../../../models";
import { mapNameToOrgAbbriv } from "../../../../util/mappings";
import { AggregatedImpactTableConfiguration } from "./DonationsAggregateImpactTable";

export type OrganizationsAggregatedSums = {
  // Organization name
  [key: string]: {
    // Total sums
    sum: number;
    custom_sum: number;
    smart_distribution_sum: number;
    periods: {
      // Period (year-month) sums
      [key: string]: {
        sum: number;
        custom_sum: number;
        smart_distribution_sum: number;
      };
    };
  };
};

export type AggregatedImpact = {
  // Output name
  [key: string]: {
    outputs: number;
    constituents: {
      // The label of the constituent, e.g.
      // "smart fordeling til Schistosomiasis Control Initiative"
      // "egen fordeling til Deworm the World Initiative"
      // Value is the number of kr. donated through this constituent
      [key: string]: number;
    };
  };
};

/**
 * Takes a list of donations and distributions and GiveWell grants
 * Aggregates donations by year and month per organization
 * Distributes share of the donation to GiveWell grants over the organizations in the grant
 * @param donations The donations to aggregate
 * @param distributions The distributions for the donations
 * @param grants GiveWell grants
 * @returns A dictionary with the aggregated sums per organization, differentiated by smart distribution and custom distribution, and per period
 */
export const aggregateOrgSumByYearAndMonth = (
  donations: Donation[],
  distributions: Map<string, Distribution>,
  grants: GiveWellGrant[] | null,
) => {
  let aggregated: OrganizationsAggregatedSums = {};

  if (!grants) return aggregated;
  const sortedGrants = grants.sort(
    (a, b) => +new Date(b.start_year, b.start_month, 1) - +new Date(a.start_year, a.start_month, 1),
  );

  donations.forEach((donation) => {
    const year = new Date(donation.timestamp).getFullYear();
    const month = new Date(donation.timestamp).getMonth();
    const orgs = distributions.get(donation.KID)?.shares;

    if (orgs) {
      orgs.forEach((org) => {
        // If organization is GiveWell top charities fund, distribute the share of the donation to the organizations in the grant
        if (org.id === 12) {
          // Get first grant before donation date
          const relevantGrant = sortedGrants.find(
            (grant) =>
              new Date(grant.start_year, grant.start_month, 1) <= new Date(donation.timestamp),
          );

          if (!relevantGrant) {
            console.error("No relevant grant found for donation", donation);
            return;
          } else {
            relevantGrant.allotment_set.forEach((allotment) => {
              // Get allotment as share of total allotment
              // E.g. AMF is 40% of the total grant, so the allotment share is .4
              const allotmentShare =
                allotment.sum_in_cents /
                relevantGrant.allotment_set.reduce((acc, curr) => acc + curr.sum_in_cents, 0);

              aggregated = addToAggregated(
                aggregated,
                donation,
                year,
                month,
                {
                  name: allotment.charity.charity_name,
                  // The share we add to the organization is equivalent to the share of givewell grant * the share of the allotment
                  // E.g. GiveWell is 20% of donation distribution, AMF is 40% of the total grant, so the share we add to AMF is .2 * .4 = .08
                  share: (parseFloat(org.share) * allotmentShare).toString(),
                },
                true,
              );
            });
          }
        } else {
          // If organization is not GiveWell top charities fund, add the share of the donation to the organization
          aggregated = addToAggregated(aggregated, donation, year, month, org, false);
        }
      });
    }
  });

  return aggregated;
};

/**
 *
 * @param aggregated The aggregated sums per organization (thus far)
 * @param donation The donation we are adding to the aggregate sums
 * @param year The year of the donation
 * @param month The month of the donation
 * @param org Which org we are adding the donation to, and it's share
 * @param smartdistribution Indicates wether the share is from a smart distribution or a custom distribution
 * @returns
 */
const addToAggregated = (
  aggregated: OrganizationsAggregatedSums,
  donation: Donation,
  year: number,
  month: number,
  org: { name: string; share: string },
  smartdistribution: boolean,
) => {
  const key = `${year}-${month}`;
  // First check if the organization is already in the aggregated sums
  // e.g. Do we have a key such that aggregated["Best charity"] exists?
  if (!(org.name in aggregated)) {
    // If not, initialize
    aggregated[org.name] = {
      sum: 0,
      custom_sum: 0,
      smart_distribution_sum: 0,
      periods: {},
    };
  }

  // If the organization is already in the aggregated sums, check if the period is already in the aggregated sums
  // e.g. Do we have a key such that aggregated["Best charity"]["2021-1"] exists?
  if (!(key in aggregated[org.name].periods)) {
    // If we have not yet aggregated sums for this period, initialize the period
    aggregated[org.name].periods[key] = {
      sum: 0,
      custom_sum: 0,
      smart_distribution_sum: 0,
    };
  }
  // Add to the total sum of the organization, regardless of period
  aggregated[org.name].sum += Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum));
  // Add to the sum of the organization for the period
  aggregated[org.name].periods[key].sum += Math.round(
    (parseFloat(org.share) / 100) * parseFloat(donation.sum),
  );
  if (smartdistribution) {
    // Add to the smart distribution sum of the organization, regardless of period
    aggregated[org.name].smart_distribution_sum += Math.round(
      (parseFloat(org.share) / 100) * parseFloat(donation.sum),
    );
    // Add to the smart distribution sum of the organization for the period
    aggregated[org.name].periods[key].smart_distribution_sum += Math.round(
      (parseFloat(org.share) / 100) * parseFloat(donation.sum),
    );
  } else {
    // Add to the custom distribution sum of the organization, regardless of period
    aggregated[org.name].custom_sum += Math.round(
      (parseFloat(org.share) / 100) * parseFloat(donation.sum),
    );
    // Add to the custom distribution sum of the organization for the period
    aggregated[org.name].periods[key].custom_sum += Math.round(
      (parseFloat(org.share) / 100) * parseFloat(donation.sum),
    );
  }

  return aggregated;
};

/**
 * Takes a dictionary of aggregated sums per organization and returns a
 * dictionary where the keys are the outputs for the given charity and the values are the
 * number of outputs and the respective contributions to the outputs
 * @param aggregatedorganizations The aggregated sums per organization and period
 * @param evaluations GiveWell evaluations for the organizations
 * @returns
 */
export const aggregateImpact = (
  aggregatedorganizations: OrganizationsAggregatedSums,
  evaluations: ImpactEvaluation[],
  textTemplates: Pick<
    AggregatedImpactTableConfiguration,
    "org_grant_template_string" | "org_direct_template_string"
  >,
) => {
  const impact: AggregatedImpact = {};

  // When calculating the impact, we loop over all the organizations in the aggregated donation sums
  // and all the periods for the organization
  // e.g. "Deworming Charity" and it's periods "2021-1", "2021-2", "2021-3", "2021-4", "2020-1"
  Object.keys(aggregatedorganizations).forEach((orgkey) => {
    if (orgkey.toLowerCase().indexOf("drift") !== -1) {
      if (!(orgkey in impact)) {
        impact[orgkey] = {
          outputs: aggregatedorganizations[orgkey].sum,
          constituents: {},
        };
      }
      return;
    }

    const abbreviation = mapNameToOrgAbbriv(orgkey);
    const filteredEvaluations = filterAndOrderEvaluations(evaluations, abbreviation);

    if (filteredEvaluations.length === 0) {
      console.error("No evaluations found for", orgkey);
      return;
    }

    let outputtype = formatOutputType(filteredEvaluations[0].intervention.short_description);

    // If the output type is not already in the impact object, initialize it
    // e.g. If impact["deworming treatments"] does not exist, initialize it
    if (!(outputtype in impact)) {
      impact[outputtype] = {
        outputs: 0,
        constituents: {},
      };
    }

    // Loop over all the periods for the organization
    // e.g. "2021-1", "2021-2", "2021-3", "2021-4", "2020-1", which is the sum of donations for the given periods to the charity
    Object.keys(aggregatedorganizations[orgkey].periods).forEach((period) => {
      const year = period.split("-")[0];
      const month = period.split("-")[1];

      // Find the evaluation that matches the year and month
      const evaluation = getRelevantEvaluation(filteredEvaluations, year, month);

      if (evaluation) {
        // Add the output to the total output
        // Equal to the sum of the organization for the period,
        // divided by cost of the intervention given by the most relevant evaluation for the given period
        impact[outputtype].outputs +=
          aggregatedorganizations[orgkey].periods[period].sum /
          evaluation.converted_cost_per_output;

        // Add the constituents to the output
        // E.g. if the output is deworming treatments, and we've added 1000 treatments
        // to the total output from a donation to "Deworming Charity",
        // we add the kr amount to the constituent "Deworming Charity"
        // Depending on wether the donation amount for the period came from a GiveWell grant or not,
        // we add the amount to the smart distribution sum or the custom distribution sum
        // (or both)

        const smartdistributionconstituentlabel = textTemplates.org_grant_template_string.replace(
          "{{org}}",
          orgkey,
        );
        //`${orgkey} via smart fordeling`;
        const customconstituentlabel = textTemplates.org_direct_template_string.replace(
          "{{org}}",
          orgkey,
        );
        //`${orgkey} direkte fordelt`;

        // The amount for the period and organization that was smart distributed is above 0
        // e.g. aggregatedorganizations["Deworming Charity"].periods["2021-1"].smart_distribution_sum is above 0
        if (aggregatedorganizations[orgkey].periods[period].smart_distribution_sum > 0) {
          if (!(smartdistributionconstituentlabel in impact[outputtype].constituents)) {
            impact[outputtype].constituents[smartdistributionconstituentlabel] = 0;
          }
          impact[outputtype].constituents[smartdistributionconstituentlabel] +=
            aggregatedorganizations[orgkey].periods[period].smart_distribution_sum;
        }

        // The amount for the period and organization that was custom distributed is above 0
        // e.g. aggregatedorganizations["Deworming Charity"].periods["2021-1"].custom_distribution_sum is above 0
        if (aggregatedorganizations[orgkey].periods[period].custom_sum > 0) {
          if (!(customconstituentlabel in impact[outputtype].constituents)) {
            impact[outputtype].constituents[customconstituentlabel] = 0;
          }
          impact[outputtype].constituents[customconstituentlabel] +=
            aggregatedorganizations[orgkey].periods[period].custom_sum;
        }
      } else {
        console.error("NO EVALUATION FOUND FOR", orgkey, period);
      }
    });
  });

  return impact;
};

/**
 * Filters impact evaluations by the given organization and orders them by date (descending)
 * @param evaluations GiveWell evaluations
 * @param abbreviation Organization abbreviation
 * @returns
 */
const filterAndOrderEvaluations = (evaluations: ImpactEvaluation[], abbreviation: string) => {
  return evaluations
    .filter((evaluation) => evaluation.charity.abbreviation === abbreviation)
    .sort((a, b) => {
      const aYear = a.start_year;
      const bYear = b.start_year;
      const aMonth = a.start_month;
      const bMonth = b.start_month;

      if (aYear < bYear) {
        return -1;
      } else if (aYear > bYear) {
        return 1;
      } else {
        if (aMonth < bMonth) {
          return -1;
        } else if (aMonth > bMonth) {
          return 1;
        } else {
          return 0;
        }
      }
    });
};

/**
 * Find the most recent evaluation that is before the given year and month
 * @param evaluations GiveWell evaluations
 * @param year
 * @param month
 * @returns The most relevant evaluation for the given year and month, or undefined if no evaluation is found
 */
const getRelevantEvaluation = (evaluations: ImpactEvaluation[], year: string, month: string) => {
  return evaluations.find(
    (e) =>
      e.start_year < parseInt(year) ||
      (e.start_year == parseInt(year) && e.start_month <= parseInt(month) + 1),
  );
};

/**
 * Convert output type to formatted string for display
 * Lowercases the output type, unless it's a special case
 * @param outputtype
 * @returns
 */
const formatOutputType = (outputtype: string) => {
  let formatted = outputtype;
  // Lowercase if output type is not A-vitamin (or any other vitamin)
  if (!formatted.match(/[A-Z]\-/)) {
    formatted = formatted.toLowerCase();
  }
  return formatted;
};

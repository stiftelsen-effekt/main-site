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
    // Outputs derived from the grant's own cost-per-output (not the evaluation)
    smart_distribution_outputs: number;
    periods: {
      // Period (year-month) sums
      [key: string]: {
        sum: number;
        custom_sum: number;
        smart_distribution_sum: number;
        smart_distribution_outputs: number;
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
      // "Schistosomiasis Control Initiative via fond"
      // "Deworm the World Initiative direkte fordelt"
      // Value is the number of kr. donated through this constituent
      [key: string]: number;
    };
  };
};

export const GIVEWELL_ALL_GRANTS_FUND_KEY = "GiveWell All Grants Fund";
export const DK_OPERATIONS_KEY = "Giv Effektivts arbejde og vækst";

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
    const globalHealthCauseArea = distributions
      .get(donation.KID)
      ?.causeAreas.filter((c) => c.id === 1)?.[0];

    const orgs = globalHealthCauseArea?.organizations ?? [];
    const globalHealthDistributionShare =
      parseFloat(globalHealthCauseArea?.percentageShare ?? "0") / 100;

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
                  percentageShare:
                    parseFloat(org.percentageShare) *
                    globalHealthDistributionShare *
                    allotmentShare,
                },
                true,
                allotment.converted_cost_per_output,
              );
            });
          }
        } else {
          // If organization is not GiveWell top charities fund, add the share of the donation to the organization
          aggregated = addToAggregated(
            aggregated,
            donation,
            year,
            month,
            {
              name: org.name as string,
              percentageShare: parseFloat(org.percentageShare) * globalHealthDistributionShare,
            },
            false,
          );
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
  org: { name: string; percentageShare: number },
  smartdistribution: boolean,
  // Grant's own cost-per-output; only provided for smart distribution
  grantCostPerOutput?: number,
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
      smart_distribution_outputs: 0,
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
      smart_distribution_outputs: 0,
    };
  }

  const amount = Math.round((org.percentageShare / 100) * parseFloat(donation.sum));

  // Add to the total sum of the organization, regardless of period
  aggregated[org.name].sum += amount;
  // Add to the sum of the organization for the period
  aggregated[org.name].periods[key].sum += amount;
  if (smartdistribution) {
    // Add to the smart distribution sum of the organization, regardless of period
    aggregated[org.name].smart_distribution_sum += amount;
    // Add to the smart distribution sum of the organization for the period
    aggregated[org.name].periods[key].smart_distribution_sum += amount;

    if (grantCostPerOutput && grantCostPerOutput > 0) {
      const outputs = amount / grantCostPerOutput;
      aggregated[org.name].smart_distribution_outputs += outputs;
      aggregated[org.name].periods[key].smart_distribution_outputs += outputs;
    }
  } else {
    // Add to the custom distribution sum of the organization, regardless of period
    aggregated[org.name].custom_sum += amount;
    // Add to the custom distribution sum of the organization for the period
    aggregated[org.name].periods[key].custom_sum += amount;
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
    if (abbreviation === "AGF") {
      if (!(GIVEWELL_ALL_GRANTS_FUND_KEY in impact)) {
        impact[GIVEWELL_ALL_GRANTS_FUND_KEY] = {
          outputs: 0,
          constituents: {},
        };
      }
      impact[GIVEWELL_ALL_GRANTS_FUND_KEY].outputs += aggregatedorganizations[orgkey].sum;
      return;
    }

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
      const periodData = aggregatedorganizations[orgkey].periods[period];

      // Smart distribution uses grant-derived outputs; direct donations fall
      // back to the most relevant evaluation estimate.
      impact[outputtype].outputs += periodData.smart_distribution_outputs;

      if (periodData.custom_sum > 0) {
        const evaluation = getRelevantEvaluation(filteredEvaluations, year, month);
        if (evaluation) {
          impact[outputtype].outputs +=
            periodData.custom_sum / evaluation.converted_cost_per_output;
        } else {
          console.error("NO EVALUATION FOUND FOR", orgkey, period);
        }
      }

      // Attribute the kr amounts to the "via fond" and/or "direkte" constituents
      // so the row can be broken down by how the money reached the organization.
      const fundconstituentlabel = textTemplates.org_grant_template_string.replace(
        "{{org}}",
        orgkey,
      );
      const customconstituentlabel = textTemplates.org_direct_template_string.replace(
        "{{org}}",
        orgkey,
      );

      if (periodData.smart_distribution_sum > 0) {
        if (!(fundconstituentlabel in impact[outputtype].constituents)) {
          impact[outputtype].constituents[fundconstituentlabel] = 0;
        }
        impact[outputtype].constituents[fundconstituentlabel] += periodData.smart_distribution_sum;
      }

      if (periodData.custom_sum > 0) {
        if (!(customconstituentlabel in impact[outputtype].constituents)) {
          impact[outputtype].constituents[customconstituentlabel] = 0;
        }
        impact[outputtype].constituents[customconstituentlabel] += periodData.custom_sum;
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

import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import style from "./DonationsDistributionTable.module.scss";
import { thousandize } from "../../../../util/formatting";
import useSWR from "swr";
import {
  Distribution,
  Donation,
  GiveWellGrant,
  ImpactEvaluation,
  Organization,
} from "../../../../models";
import { DistributionsRow } from "./DistributionsRow";
import { mapNameToOrgAbbriv } from "../../shared/lists/donationList/DonationDetails";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const multiFetcher = (...urls: string[]) => {
  const f = (u: string) => fetch(u).then((r) => r.json());
  return Promise.all(urls.map(f));
};

export type OrganizationsAggregatedSums = {
  // Organization name
  [key: string]: {
    sum: number;
    custom_sum: number;
    smart_distribution_sum: number;
    periods: {
      // Period (year-month)
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

const DonationsDistributionTable: React.FC<{
  donations: Donation[];
  distributionMap: Map<string, Distribution>;
}> = ({ donations, distributionMap }) => {
  const [expanded, setExpanded] = useState(true);

  const {
    data: impactdata,
    error: imacterror,
    isValidating: impactvalidating,
  } = useSWR<{ max_impact_fund_grants: GiveWellGrant[] }>(
    `https://impact.gieffektivt.no/api/max_impact_fund_grants?currency=NOK&language=NO`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const aggregated = aggregateOrgSumByYearAndMonth(
    donations,
    distributionMap,
    impactdata ? impactdata.max_impact_fund_grants : null,
  );

  const urls: string[] = [];
  for (const orgKey of Object.keys(aggregated)) {
    if (orgKey.toLowerCase().indexOf("drift") !== -1) continue;
    const abbriv = mapNameToOrgAbbriv(orgKey);
    for (const key of Object.keys(aggregated[orgKey].periods)) {
      const year = key.split("-")[0];
      const month = key.split("-")[1];
      urls.push(
        `https://impact.gieffektivt.no/api/evaluations?currency=NOK&language=NO&donation_year=${year}&donation_month=${
          parseInt(month) + 1
        }&charity_abbreviation=${abbriv}`,
      );
    }
  }

  const {
    data: evaluationdata,
    error: evaluationerror,
    isValidating: evaluationvalidating,
  } = useSWR<{ evaluations: ImpactEvaluation[] }[]>(urls, multiFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (!impactdata || impactvalidating || !evaluationdata || evaluationvalidating) {
    return <div>Loading...</div>;
  }

  if (imacterror || evaluationerror) {
    return (
      <div>
        {imacterror}
        {evaluationerror}
      </div>
    );
  }

  let mappedEvaluations = evaluationdata.map((d) => d.evaluations).flat();

  const impact = aggregateImpact(aggregated, mappedEvaluations);

  return (
    <div className={style.distribution} data-cy="aggregated-distribution-table">
      <div className={style.distributionHeader} onClick={() => setExpanded(!expanded)}>
        <span>Fordeling</span>
        <ChevronDown size={"24"} color={"black"} className={expanded ? style.chevronRotated : ""} />
      </div>
      <AnimateHeight height={expanded ? "auto" : 0}>
        <table cellSpacing={0}>
          <tbody>
            {Object.keys(impact).map((key: string) =>
              key.toLowerCase().indexOf("drift") === -1 ? (
                <DistributionsRow aggregatedimpact={impact} outputkey={key}></DistributionsRow>
              ) : null,
            )}
          </tbody>
        </table>
      </AnimateHeight>
    </div>
  );
};

const aggregateOrgSumByYearAndMonth = (
  donations: Donation[],
  distributions: Map<string, Distribution>,
  grants: GiveWellGrant[] | null,
) => {
  let aggregated: OrganizationsAggregatedSums = {};

  if (!grants) return aggregated;

  donations.forEach((donation) => {
    const year = new Date(donation.timestamp).getFullYear();
    const month = new Date(donation.timestamp).getMonth();
    const orgs = distributions.get(donation.KID)?.shares;

    if (orgs) {
      orgs.forEach((org) => {
        if (org.id === 12) {
          // Get first grant before donation date
          const relevantGrant = grants
            .sort(
              (a, b) =>
                +new Date(b.start_year, b.start_month, 1) -
                +new Date(a.start_year, a.start_month, 1),
            )
            .find(
              (grant) =>
                new Date(grant.start_year, grant.start_month, 1) <= new Date(donation.timestamp),
            );

          if (!relevantGrant) {
            console.error("No relevant grant found for donation", donation);
            return;
          } else {
            relevantGrant.allotment_set.forEach((allotment) => {
              // Get allotment as share of total allotment
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
                  share: (parseFloat(org.share) * allotmentShare).toString(),
                },
                true,
              );
            });
          }
        } else {
          aggregated = addToAggregated(aggregated, donation, year, month, org, false);
        }
      });
    }
  });

  return aggregated;
};

const addToAggregated = (
  aggregated: OrganizationsAggregatedSums,
  donation: Donation,
  year: number,
  month: number,
  org: { name: string; share: string },
  smartdistribution: boolean,
) => {
  const key = `${year}-${month}`;
  if (org.name in aggregated) {
    if (!(key in aggregated[org.name].periods)) {
      aggregated[org.name].periods[key] = {
        sum: 0,
        custom_sum: 0,
        smart_distribution_sum: 0,
      };
    }
    aggregated[org.name].sum += Math.round(
      (parseFloat(org.share) / 100) * parseFloat(donation.sum),
    );
    aggregated[org.name].periods[key].sum += Math.round(
      (parseFloat(org.share) / 100) * parseFloat(donation.sum),
    );
    if (smartdistribution) {
      aggregated[org.name].smart_distribution_sum += Math.round(
        (parseFloat(org.share) / 100) * parseFloat(donation.sum),
      );
      aggregated[org.name].periods[key].smart_distribution_sum += Math.round(
        (parseFloat(org.share) / 100) * parseFloat(donation.sum),
      );
    } else {
      aggregated[org.name].custom_sum += Math.round(
        (parseFloat(org.share) / 100) * parseFloat(donation.sum),
      );
      aggregated[org.name].periods[key].custom_sum += Math.round(
        (parseFloat(org.share) / 100) * parseFloat(donation.sum),
      );
    }
  } else {
    aggregated[org.name] = {
      sum: Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum)),
      smart_distribution_sum: smartdistribution
        ? Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum))
        : 0,
      custom_sum: smartdistribution
        ? 0
        : Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum)),
      periods: {
        [key]: {
          sum: Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum)),
          smart_distribution_sum: smartdistribution
            ? Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum))
            : 0,
          custom_sum: smartdistribution
            ? 0
            : Math.round((parseFloat(org.share) / 100) * parseFloat(donation.sum)),
        },
      },
    };
  }

  return aggregated;
};

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

const aggregateImpact = (
  aggregatedorganizations: OrganizationsAggregatedSums,
  evaluations: ImpactEvaluation[],
) => {
  const impact: AggregatedImpact = {};

  Object.keys(aggregatedorganizations).forEach((orgkey) => {
    if (orgkey.toLowerCase().indexOf("drift") !== -1) return;

    const abbreviation = mapNameToOrgAbbriv(orgkey);
    const filteredEvaluations = filterAndOrderEvaluations(evaluations, abbreviation);

    let outputtype = filteredEvaluations[0].intervention.short_description;

    // Lowercase if output type is not A-vitamin
    if (!outputtype.match(/[A-Z]\-/)) {
      outputtype = outputtype.toLowerCase();
    }

    if (!(outputtype in impact)) {
      impact[outputtype] = {
        outputs: 0,
        constituents: {},
      };
    }

    Object.keys(aggregatedorganizations[orgkey].periods).forEach((period) => {
      const year = period.split("-")[0];
      const month = period.split("-")[1];

      // Find the evaluation that matches the year and month
      const evaluation = filteredEvaluations.find(
        (e) =>
          e.start_year < parseInt(year) ||
          (e.start_year == parseInt(year) && e.start_month <= parseInt(month) + 1),
      );

      if (evaluation) {
        impact[outputtype].outputs +=
          aggregatedorganizations[orgkey].periods[period].sum /
          evaluation.converted_cost_per_output;
        const smartdistributionconstituentlabel = `${orgkey} via smart fordeling`;
        const customconstituentlabel = `${orgkey} direkte fordelt`;

        if (aggregatedorganizations[orgkey].periods[period].smart_distribution_sum > 0) {
          if (!(smartdistributionconstituentlabel in impact[outputtype].constituents)) {
            impact[outputtype].constituents[smartdistributionconstituentlabel] = 0;
          }
          impact[outputtype].constituents[smartdistributionconstituentlabel] +=
            aggregatedorganizations[orgkey].periods[period].smart_distribution_sum;
        }

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

export default DonationsDistributionTable;

import React, { useLayoutEffect, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import style from "./DonationsDistributionTable.module.scss";
import useSWR from "swr";
import { Distribution, Donation, GiveWellGrant, ImpactEvaluation } from "../../../../models";
import { DistributionsRow } from "./DistributionsRow";
import { LoadingButtonSpinner } from "../../../shared/components/Spinner/LoadingButtonSpinner";
import { aggregateImpact, aggregateOrgSumByYearAndMonth } from "./_util";
import { mapNameToOrgAbbriv } from "../../../../util/mappings";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const multiFetcher = (...urls: string[]) => {
  const f = (u: string) => fetch(u).then((r) => r.json());
  return Promise.all(urls.map(f));
};

const DonationsDistributionTable: React.FC<{
  donations: Donation[];
  distributionMap: Map<string, Distribution>;
}> = ({ donations, distributionMap }) => {
  const [expanded, setExpanded] = useState(true);
  const [loadedClass, setLoadedClass] = useState<string>("");
  const [lastimpactCount, setLastimpactCount] = useState<number>(0);
  const [currentHeight, setCurrentHeight] = useState<number | "auto">(0);
  const [currentTimeoutId, setCurrentTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: impactdata,
    error: impacterror,
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
        `https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=${abbriv}&currency=NOK&language=NO&donation_year=${year}&donation_month=${
          parseInt(month) + 1
        }`,
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

  useLayoutEffect(() => {
    if (
      (typeof evaluationdata !== "undefined" &&
        typeof impactdata !== "undefined" &&
        !evaluationvalidating &&
        !impactvalidating) ||
      donations.length == 0
    ) {
      setTimeout(() => setLoadedClass(style.loaded), 50);
    } else {
      setTimeout(() => setLoadedClass(""));
    }
  }, [impactdata, evaluationdata]);

  let impact = {};
  let loading = true;
  let mappedEvaluations = [];
  if (impactdata && !impactvalidating && evaluationdata && !evaluationvalidating) {
    mappedEvaluations = evaluationdata.map((d) => d.evaluations).flat();
    impact = aggregateImpact(aggregated, mappedEvaluations);
    loading = false;
  }

  if (impacterror || evaluationerror) {
    return (
      <div>
        {JSON.stringify(impacterror)}
        {JSON.stringify(evaluationerror)}
      </div>
    );
  }

  const currentImpactCount = Object.keys(impact).length;
  if (!loading && lastimpactCount !== currentImpactCount) {
    setLastimpactCount(currentImpactCount);
  }

  if (currentImpactCount != lastimpactCount || loading) {
    const height = tableContainerRef.current?.clientHeight;
    if (currentHeight != height && typeof height !== "undefined") {
      setCurrentHeight(height);
    }
  } else {
    if (currentHeight !== "auto") {
      if (currentTimeoutId === null) {
        const timeoutId: NodeJS.Timeout = setTimeout(() => {
          setCurrentHeight("auto");
          clearTimeout(timeoutId);
          setCurrentTimeoutId(null);
        }, 100);
        setCurrentTimeoutId(timeoutId);
      }
    }
  }

  return (
    <div
      className={[style.distribution, loadedClass].join(" ")}
      data-cy="aggregated-distribution-table"
    >
      <div className={style.distributionHeader} onClick={() => setExpanded(!expanded)}>
        <span>
          Estimert effekt
          <div className={style.loadingSpinner}>
            <LoadingButtonSpinner />
          </div>
        </span>

        <ChevronDown size={"24"} color={"black"} className={expanded ? style.chevronRotated : ""} />
      </div>
      <AnimateHeight height={expanded ? currentHeight : 0}>
        <div
          ref={tableContainerRef}
          style={{
            height: expanded ? currentHeight : "auto",
            overflow: "hidden",
          }}
        >
          <table
            cellSpacing={0}
            className={style.maintable}
            data-cy="aggregated-distribution-table-main"
          >
            <tbody>
              {Object.keys(impact)
                .filter((key) => key.toLowerCase().indexOf("drift") === -1)
                .sort((a: string, b: string) => (b < a ? 1 : -1))
                .map((key: string) => (
                  <DistributionsRow
                    aggregatedimpact={impact}
                    outputkey={key}
                    key={key}
                  ></DistributionsRow>
                ))}
              {Object.keys(impact)
                .filter((key) => key.toLowerCase().indexOf("drift") !== -1)
                .map((key: string) => (
                  <DistributionsRow
                    aggregatedimpact={impact}
                    outputkey={key}
                    key={key}
                  ></DistributionsRow>
                ))}
            </tbody>
          </table>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default DonationsDistributionTable;

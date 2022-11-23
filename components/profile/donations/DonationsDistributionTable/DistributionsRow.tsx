import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../models";
import { thousandize, thousandizeString } from "../../../../util/formatting";
import { mapNameToOrgAbbriv } from "../../shared/lists/donationList/DonationDetails";
import { AggregatedImpact, OrganizationsAggregatedSums } from "./DonationsDistributionTable";
import style from "./DonationsDistributionTable.module.scss";

const multiFetcher = (...urls: string[]) => {
  const f = (u: string) => fetch(u).then((r) => r.json());
  return Promise.all(urls.map(f));
};

export const DistributionsRow: React.FC<{
  outputkey: string;
  aggregatedimpact: AggregatedImpact;
}> = ({ outputkey, aggregatedimpact }) => {
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(true);

  useLayoutEffect(() => {
    update();
  }, []);

  const update = useCallback(() => {
    setTimeout(() => {
      setAnimate(false);
    }, 100);
  }, [setAnimate]);

  const impact = aggregatedimpact[outputkey];

  let requiredPrecision = 0;
  while (parseFloat(impact.outputs.toFixed(requiredPrecision)) === 0 && requiredPrecision < 3) {
    requiredPrecision += 1;
  }

  const formattedOutput = thousandizeString(
    (Math.round(impact.outputs * Math.pow(10, requiredPrecision)) / Math.pow(10, requiredPrecision))
      .toFixed(requiredPrecision)
      .replace(/\./, ","),
  );

  const animateClass = animate ? "" : style.rowloaded;

  return (
    <>
      <tr
        key={outputkey}
        onClick={() => setExpanded(!expanded)}
        className={[style.expandable, animateClass].join(" ")}
      >
        <td>
          <strong>{formattedOutput}</strong>&nbsp;<span>{outputkey}</span>
        </td>
        <td className={style.rowexpand}>
          <ChevronDown
            size={"1.3rem"}
            color={"white"}
            style={{ transform: expanded ? "rotate(180deg)" : "" }}
          />
        </td>
      </tr>
      <tr key={`${outputkey}-expander`}>
        <td colSpan={2}>
          <AnimateHeight duration={300} height={expanded ? "auto" : 0} animateOpacity>
            <div className={style.innertable}>
              <table cellSpacing={0}>
                {Object.keys(impact.constituents).map((key) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{thousandize(impact.constituents[key])} kr</td>
                  </tr>
                ))}
              </table>
            </div>
          </AnimateHeight>
        </td>
      </tr>
    </>
  );
};

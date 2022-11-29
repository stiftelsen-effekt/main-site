import React from "react";
import style from "./DonationsChart.module.scss";
import { thousandize } from "../../../../util/formatting";
import { Organization } from "../../../../models";

const DonationsChart: React.FC<{
  distribution: { org: string; sum: number }[];
  organizations: Organization[];
}> = ({ distribution, organizations }) => {
  const total = distribution.reduce((acc, curr) => acc + curr.sum, 0);

  const sortedOrgs = organizations.sort(
    (a: Organization, b: Organization) =>
      (distribution.find((d) => d.org == b.name)?.sum ?? 0) -
      (distribution.find((d) => d.org == a.name)?.sum ?? 0),
  );

  return (
    <div
      className={style.graph + " " + (distribution.length == 0 ? style.empty : "")}
      data-cy="aggregated-donations-distribution-graph"
    >
      {sortedOrgs.map((org: Organization, i: number) => {
        const dist = distribution.find((d) => d.org == org.name);
        if (!dist) {
          return (
            <div
              key={i}
              style={{
                width: `0%`,
                borderWidth: "0px",
                zIndex: sortedOrgs.length - i,
              }}
              data-cy="aggregated-donations-distribution-graph-bar"
            >
              <span>{org.name}</span>
              <span>{"0" + " kr"}</span>
            </div>
          );
        }

        return (
          <div
            key={i}
            style={{
              width: `${(dist.sum / total) * 100}%`,
              zIndex: sortedOrgs.length - i,
            }}
            data-cy="aggregated-donations-distribution-graph-bar"
          >
            <span>{org.name}</span>
            <span>{thousandize(Math.floor(dist.sum)) + " kr"}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DonationsChart;

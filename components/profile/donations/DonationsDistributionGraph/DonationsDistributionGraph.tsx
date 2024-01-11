import style from "./DonationsDistributionGraph.module.scss";
import { Distribution } from "../../../../models";
import { thousandize } from "../../../../util/formatting";

export const DonationsDistributionGraph: React.FC<{ sum: string; distribution: Distribution }> = ({
  sum,
  distribution,
}) => {
  const max = Math.max(
    ...distribution.causeAreas[0].organizations.map((org) => parseFloat(org.percentageShare)),
  );
  distribution.causeAreas[0].organizations = distribution.causeAreas[0].organizations.sort(
    (a, b) => parseFloat(b.percentageShare) - parseFloat(a.percentageShare),
  );

  return (
    <div className={style.wrapper} data-cy="donation-distribution-graph">
      <div className={style.bars}>
        {distribution.causeAreas[0].organizations.map((dist) => (
          <div
            key={dist.name}
            className={style.bar}
            style={{ width: `${(parseFloat(dist.percentageShare) / max) * 100}%` }}
            data-cy="donation-distribution-graph-bar"
          >
            <div key={dist.name} className={style.label}>
              <div>{dist.name}</div>
              <div>
                {thousandize(
                  Math.round((parseFloat(dist.percentageShare) / 100) * parseFloat(sum)),
                )}{" "}
                kr
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

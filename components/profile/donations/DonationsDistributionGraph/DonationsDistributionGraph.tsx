import style from "./DonationsDistributionGraph.module.scss";
import { Distribution } from "../../../../models";
import { thousandize } from "../../../../util/formatting";

export const DonationsDistributionGraph: React.FC<{ sum: string; distribution: Distribution }> = ({
  sum,
  distribution,
}) => {
  const max = Math.max(...distribution.shares.map((org) => parseFloat(org.share)));
  distribution.shares = distribution.shares.sort(
    (a, b) => parseFloat(b.share) - parseFloat(a.share),
  );

  return (
    <div className={style.wrapper} data-cy="donation-distribution-graph">
      <div className={style.bars}>
        {distribution.shares.map((dist) => (
          <div
            key={dist.name}
            className={style.bar}
            style={{ width: `${(parseFloat(dist.share) / max) * 100}%` }}
            data-cy="donation-distribution-graph-bar"
          >
            <div key={dist.name} className={style.label}>
              <div>{dist.name}</div>
              <div>
                {thousandize(Math.round((parseFloat(dist.share) / 100) * parseFloat(sum)))} kr
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import style from "./ChartSkeleton.module.scss";

export const FundraiserChartSkeleton: React.FC<{ numberOfFundraisers: number }> = ({
  numberOfFundraisers,
}) => {
  const bars = [];

  for (let i = 0; i < numberOfFundraisers; i++) {
    bars.push(
      <div
        className={style.fundraiserBar}
        style={{
          width: `${((numberOfFundraisers - i) / numberOfFundraisers) * 90 + 10}%`,
        }}
      >
        <div className={style.fundraiserName}></div>
      </div>,
    );
  }

  return <div className={style.wrapper}>{...bars}</div>;
};

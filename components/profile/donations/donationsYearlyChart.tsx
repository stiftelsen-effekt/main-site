import React from "react";
import style from "../../../styles/DonationsYearlyChart.module.css";
import { thousandize } from "../../../util/formatting";

export const DonationsYearlyGraph: React.FC<{ data: { year: string; sum: number }[] }> = ({
  data,
}) => {
  const max = Math.max(...data.map((el) => el.sum));

  return (
    <div className={style.wrapper}>
      <div className={style.bars}>
        {data.map((el) => (
          <div
            key={el.year}
            className={style.bar}
            style={{ height: `${(el.sum / max) * 100}%` }}
          ></div>
        ))}
      </div>
      <div className={style.labels}>
        {data.map((el) => (
          <div key={el.year} className={style.label}>
            <span>{el.year}</span>
            <span>{thousandize(Math.round(el.sum))} kr</span>
          </div>
        ))}
      </div>
    </div>
  );
};

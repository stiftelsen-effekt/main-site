import React from "react";
import style from "./DonationsTotal.module.scss";
import { thousandize } from "../../../../util/formatting";

const DonationsTotals: React.FC<{ sum: number; period: string; comparison?: string }> = ({
  sum,
  period,
  comparison,
}) => {
  return (
    <div className={style.totals} data-cy="aggregated-donation-totals">
      <span className={style.period}>{period}</span>
      <h2>{thousandize(sum)} kr</h2>
      {comparison && <h4>{comparison}</h4>}
    </div>
  );
};

export default DonationsTotals;

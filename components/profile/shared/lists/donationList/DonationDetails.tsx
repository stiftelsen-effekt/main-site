import React from "react";
import style from "./DonationDetails.module.scss";
import { Distribution } from "../../../../../models";
import { DonationsDistributionGraph } from "../../../donations/DonationsDistributionGraph/DonationsDistributionGraph";

export const DonationDetails: React.FC<{ sum: string; distribution: Distribution }> = ({
  sum,
  distribution,
}) => {
  return (
    <div className={style.wrapper}>
      <div className={style.graph}>
        <DonationsDistributionGraph sum={sum} distribution={distribution} />
      </div>

      <div className={style.actions}>
        <ul>
          {/**
           *           <li>
            <a href="#">
              <FileText size={16} color={"black"} /> <span>Kvittering</span>
            </a>
          </li>
           */}
        </ul>
      </div>
    </div>
  );
};

import React from "react";
import style from "../../../styles/DonationsDetails.module.css"
import { Distribution } from "../../../models";
import { DonationsDistributionGraph } from "../../profile/donations/donationsDistributionGraph";
import { FileText } from "react-feather";

export const DonationDetails: React.FC<{ sum: string, distribution: Distribution }> = ({ sum, distribution }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.graph}>
        <DonationsDistributionGraph sum={sum} distribution={distribution} />
      </div>
      
      <div className={style.actions}>
        <ul>
          <li><a href="#"><FileText size={16} color={'black'} /> <span>Kvittering</span></a></li>
        </ul>
      </div>
    </div>
  )
}
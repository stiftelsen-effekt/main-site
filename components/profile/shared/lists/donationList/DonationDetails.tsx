import React from "react";
import style from "./DonationDetails.module.scss";
import { Distribution, Donation } from "../../../../../models";
import DonationImpact from "../../../donations/DonationImpact/DonationImpact";
import { mapNameToOrgAbbriv } from "../../../../../util/mappings";

export const DonationDetails: React.FC<{
  sum: string;
  donation: Donation;
  distribution: Distribution;
  timestamp: Date;
}> = ({ sum, donation, distribution, timestamp }) => {
  const mappedDistribution = distribution.shares.map((org) => ({
    org: mapNameToOrgAbbriv(org.name) || org.name,
    sum: parseFloat(sum) * (parseFloat(org.share) / 100),
  }));

  return (
    <div className={style.wrapper}>
      <div className={style.impactEstimate}>
        <strong>Estimert effekt</strong>
        {/** Custom caching WIP */}
        {/* <SWRConfig value={{ provider: () => ImpactCache }}> */}
        <DonationImpact
          donation={donation}
          distribution={mappedDistribution}
          timestamp={timestamp}
        />
        {/*</SWRConfig>*/}
      </div>

      <div className={style.actions}>
        {/*<strong>Handlinger</strong>*/}
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

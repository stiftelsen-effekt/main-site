import React from "react";
import style from "./DonationDetails.module.scss";
import { Distribution } from "../../../../../models";
import DonationImpact from "../../../donations/DonationImpact/DonationImpact";
import { Dictionary } from "cypress/types/lodash";
import { SWRConfig } from "swr";

export const DonationDetails: React.FC<{
  sum: string;
  distribution: Distribution;
  timestamp: Date;
}> = ({ sum, distribution, timestamp }) => {
  const mappedDistribution = distribution.organizations.map((org) => ({
    org: mapNameToOrgAbbriv(org.name) || org.name,
    sum: parseFloat(sum) * (parseFloat(org.share) / 100),
  }));

  return (
    <div className={style.wrapper}>
      <div className={style.impactEstimate}>
        <strong>Estimert effekt</strong>
        {/** Custom caching WIP */}
        {/* <SWRConfig value={{ provider: () => ImpactCache }}> */}
        <DonationImpact distribution={mappedDistribution} timestamp={timestamp} />
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

const mapNameToOrgAbbriv = (name: string): string => {
  const map = {
    "Against Malaria Foundation": "AMF",
    "SCI Foundation": "SCI",
    GiveDirectly: "GD",
    "GiveDirectly Borgerlønn": "GD",
    "Helen Keller International": "HKI",
    "New Incentives": "NI",
    "The End Fund": "END",
    "Deworm the World": "DTW",
    Sightsavers: "SS",
    Drift: "Drift",
    "GiveWell Maximum Impact Fund": "GiveWell",
    "Malaria Consortium": "MC",
    "Project Healthy Children": "PHC",
    "Drift av Gi Effektivt": "Drift",
  };
  return (map as Dictionary<string>)[name];
};

import React, { useCallback, useState } from "react";
import { Donation } from "../../../../../models";
import style from "./DonationImpactAnimalWelfare.module.scss";
import {
  DonationImpactItemAnimalWelfare,
  ImpactItemConfiguration,
} from "./DonationImpactItemAnimalWelfare";

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  operations_label: string;
  impact_item_configuration: ImpactItemConfiguration;
};

const DonationImpactAnimalWelfare: React.FC<{
  donation: Donation;
  distribution: { org: string; sum: number }[];
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
}> = ({ donation, distribution, timestamp, configuration }) => {
  const [requiredPrecision, setRequiredPrecision] = useState(0);
  const updatePrecision = useCallback(
    (precision: number) => {
      setRequiredPrecision(precision);
    },
    [setRequiredPrecision],
  );

  const filteredDistribution = distribution
    .filter((d) => d.org !== "GiveWell")
    .map((o) => ({ ...o }))
    .sort(function (a, b) {
      var key = "Drift";
      if (a.org === key && b.org != key) return -1;
      if (a.org != key && b.org === key) return 1;
      return 0;
    });

  let spreadDistribution: { org: string; sum: number }[] = [...filteredDistribution];

  return (
    <div className={style.container} key={`${donation.id}-impact`}>
      <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
        <tbody>
          {spreadDistribution.map((dist, i) => (
            <React.Fragment key={`${donation.id}-impact-${dist.org}`}>
              {dist.org !== "Drift" && (
                <DonationImpactItemAnimalWelfare
                  orgAbriv={dist.org}
                  sumToOrg={dist.sum}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={(precision) => {
                    if (precision > requiredPrecision) updatePrecision(precision);
                  }}
                  configuration={configuration.impact_item_configuration}
                />
              )}
              {dist.org === "Drift" && (
                <tr>
                  <td className={style.impact} colSpan={100}>
                    <span>{configuration.operations_label}</span>
                    <strong>{`${dist.sum} kr`}</strong>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationImpactAnimalWelfare;

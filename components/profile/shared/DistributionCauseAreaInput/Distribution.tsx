import React from "react";
import { DistributionCauseArea } from "../../../../models";
import style from "./Distribution.module.scss";
import { useCauseAreas } from "../../../../_queries";
import { useAuth0 } from "@auth0/auth0-react";
import { isAllocationVisible } from "../distributionAmounts";

export const DistributionController: React.FC<{
  causeArea: DistributionCauseArea;
  savedCauseArea?: DistributionCauseArea;
  onChange: (causeArea: DistributionCauseArea) => void;
}> = ({ causeArea, savedCauseArea = causeArea, onChange }) => {
  const { getAccessTokenSilently } = useAuth0();

  const { data: causeAreas, loading: causeArasLoading } = useCauseAreas(getAccessTokenSilently);

  if (causeArasLoading) return <div>Loading cause areas...</div>;

  if (!causeAreas?.length) return <div>No cause areas found</div>;

  const currentCauseAreaOrgs = causeAreas.find((ca) => ca.id === causeArea.id)?.organizations;

  if (!currentCauseAreaOrgs)
    return <div>Cause in current distribution not found (id {causeArea.id})</div>;

  return (
    <div className={style.wrapper}>
      <div className={style.grid}>
        {currentCauseAreaOrgs
          .filter((org) =>
            isAllocationVisible(
              org.isActive,
              savedCauseArea.organizations.find((organization) => organization.id === org.id)
                ?.amount,
            ),
          )
          .map((org) => (
            <div key={org.id} className={style["share-wrapper"]}>
              <span>{org.widgetDisplayName || org.name}</span>
              <div>
                <input
                  type="text"
                  value={
                    causeArea.organizations?.find((organization) => organization.id === org.id)
                      ?.amount ?? 0
                  }
                  onChange={(e) => {
                    const amount = Math.max(0, parseInt(e.target.value, 10) || 0);
                    const organizations = [...causeArea.organizations];
                    const index = organizations.findIndex((o) => o.id === org.id);
                    if (index === -1) {
                      organizations.push({
                        id: org.id,
                        name: org.name,
                        percentageShare: "0",
                        amount,
                      });
                    } else {
                      organizations[index] = {
                        ...organizations[index],
                        amount,
                      };
                    }
                    onChange({
                      ...causeArea,
                      amount: organizations.reduce(
                        (total, organization) => total + (organization.amount ?? 0),
                        0,
                      ),
                      organizations,
                    });
                  }}
                  data-cy="distribution-input"
                />
                <span>kr</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

import React from "react";
import { DistributionCauseArea } from "../../../../models";
import style from "./Distribution.module.scss";
import { useCauseAreas } from "../../../../_queries";
import { useAuth0 } from "@auth0/auth0-react";
import AnimateHeight from "react-animate-height";

export const DistributionController: React.FC<{
  causeArea: DistributionCauseArea;
  onChange: (causeArea: DistributionCauseArea) => void;
}> = ({ causeArea, onChange }) => {
  const { getAccessTokenSilently } = useAuth0();

  const { data: causeAreas, loading: causeArasLoading } = useCauseAreas(getAccessTokenSilently);

  const sum = causeArea.organizations?.reduce(
    (acc, curr) => acc + parseFloat(curr.percentageShare),
    0,
  );

  if (causeArasLoading) return <div>Loading cause areas...</div>;

  if (!causeAreas?.length) return <div>No cause areas found</div>;

  const currentCauseAreaOrgs = causeAreas.find((ca) => ca.id === causeArea.id)?.organizations;

  if (!currentCauseAreaOrgs)
    return <div>Cause in current distribution not found (id {causeArea.id})</div>;

  return (
    <div className={style.wrapper}>
      <div className={style.grid}>
        {currentCauseAreaOrgs.map((org) => (
          <div key={org.id} className={style["share-wrapper"]}>
            <span>{org.name}</span>
            <div>
              <input
                type="text"
                defaultValue={
                  Math.round(
                    parseFloat(
                      causeArea.organizations?.find((o) => o.id === org.id)?.percentageShare || "0",
                    ),
                  ).toString() || 0
                }
                onChange={(e) => {
                  const percentageShare = parseFloat(e.target.value) || 0;
                  const organizations = [...causeArea.organizations];
                  const index = organizations.findIndex((o) => o.id === org.id);
                  if (index === -1) {
                    organizations.push({
                      id: org.id,
                      name: org.name,
                      percentageShare: percentageShare.toFixed(0),
                    });
                  } else {
                    organizations[index] = {
                      ...organizations[index],
                      percentageShare: percentageShare.toFixed(0),
                    };
                  }
                  onChange({ ...causeArea, organizations });
                }}
                data-cy="distribution-input"
              />
              <span>%</span>
            </div>
          </div>
        ))}
      </div>
      <AnimateHeight height={sum !== 100 ? "auto" : 0} animateOpacity={true}>
        <div className={style["warning-box"]} data-cy="distribution-warning">
          Fordeling må summere til 100 <span>{sum} / 100</span>
        </div>
      </AnimateHeight>
    </div>
  );
};

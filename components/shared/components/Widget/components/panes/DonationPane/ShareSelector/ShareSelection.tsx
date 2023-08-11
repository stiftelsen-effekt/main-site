import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Validator from "validator";
import { setShares } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import { ShareContainer, ShareInputContainer, ShareLink } from "./ShareSelection.style";
import AnimateHeight from "react-animate-height";
import { CauseArea } from "../../../../types/CauseArea";

export const SharesSelection: React.FC<{ causeArea: CauseArea; open: boolean }> = ({
  causeArea,
  open,
}) => {
  const dispatch = useDispatch();
  const organizations = causeArea.organizations;
  const distributionCauseAreas = useSelector(
    (state: State) => state.donation.distributionCauseAreas,
  );
  const distributionCauseArea = distributionCauseAreas.find(
    (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
  );
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [open, wrapperRef]);

  if (!distributionCauseArea) return <div>Ingen fordeling for saksområde</div>;
  if (!organizations) return <div>Ingen organisasjoner</div>;

  return (
    <AnimateHeight height={open ? "auto" : 0} duration={300} animateOpacity>
      <ShareContainer ref={wrapperRef}>
        {distributionCauseArea.organizations.map((org) => (
          <ShareInputContainer key={org.id}>
            <ShareLink
              href={
                organizations.filter((org) => org.id === org.id)[0].id === 12
                  ? "https://gieffektivt.no/smart-fordeling"
                  : `https://gieffektivt.no/topplista/#${organizations
                      .filter((org) => org.id === org.id)[0]
                      .name.replace(/ /g, "_")}`
              }
            >
              <label htmlFor={org.id.toString()}>
                {organizations.filter((o) => o.id === org.id)[0].name}
              </label>
            </ShareLink>
            <input
              data-cy={`org-${org.id}`}
              name={org.id.toString()}
              placeholder="0"
              value={org.percentageShare}
              onChange={(e) => {
                const newOrganizationShares = [...distributionCauseArea.organizations];
                const index = newOrganizationShares.map((s) => s.id).indexOf(org.id);

                if (e.target.value === "") {
                  newOrganizationShares[index].percentageShare = "0";
                } else if (Validator.isInt(e.target.value)) {
                  const newSplit = parseInt(e.target.value);
                  if (newSplit <= 100 && newSplit >= 0) {
                    newOrganizationShares[index].percentageShare = newSplit.toString();
                  }
                }

                dispatch(setShares(distributionCauseArea.id, newOrganizationShares));
              }}
            />
          </ShareInputContainer>
        ))}
      </ShareContainer>
    </AnimateHeight>
  );
};

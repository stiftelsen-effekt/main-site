import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Validator from "validator";
import { setShares } from "../../../../store/donation/actions";
import { CauseAreaOrgs, State } from "../../../../store/state";
import { ShareContainer, ShareInputContainer, ShareLink } from "./ShareSelection.style";
import AnimateHeight from "react-animate-height";

export const SharesSelection: React.FC<{ causeAreaOrgs: CauseAreaOrgs; open: boolean }> = ({
  causeAreaOrgs,
  open,
}) => {
  const dispatch = useDispatch();
  const organizations = causeAreaOrgs.organizations;
  const shareState = useSelector((state: State) => state.donation.shares);
  const shares = shareState.find((share) => share.causeArea === causeAreaOrgs.name);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [open, wrapperRef]);

  if (!shares) return <div>Ingen fordeling for saksområde</div>;
  if (!organizations) return <div>Ingen organisasjoner</div>;

  return (
    <AnimateHeight height={open ? "auto" : 0} duration={300} animateOpacity>
      <ShareContainer ref={wrapperRef}>
        {shares.organizationShares.map((share) => (
          <ShareInputContainer key={share.id}>
            <ShareLink
              href={
                organizations.filter((org) => org.id === share.id)[0].id === 12
                  ? "https://gieffektivt.no/smart-fordeling"
                  : `https://gieffektivt.no/topplista/#${organizations
                      .filter((org) => org.id === share.id)[0]
                      .name.replace(/ /g, "_")}`
              }
            >
              <label htmlFor={share.id.toString()}>
                {organizations.filter((org) => org.id === share.id)[0].name}
              </label>
            </ShareLink>
            <input
              data-cy={`org-${share.id}`}
              name={share.id.toString()}
              placeholder="0"
              value={share.split.toString()}
              onChange={(e) => {
                const newOrganizationShares = [...shares.organizationShares];
                const index = newOrganizationShares.map((s) => s.id).indexOf(share.id);

                if (e.target.value === "") {
                  newOrganizationShares[index].split = 0;
                } else if (Validator.isInt(e.target.value)) {
                  const newSplit = parseInt(e.target.value);
                  if (newSplit <= 100 && newSplit >= 0) {
                    newOrganizationShares[index].split = newSplit;
                  }
                }

                dispatch(setShares(shares.causeArea, newOrganizationShares));
              }}
            />
          </ShareInputContainer>
        ))}
      </ShareContainer>
    </AnimateHeight>
  );
};

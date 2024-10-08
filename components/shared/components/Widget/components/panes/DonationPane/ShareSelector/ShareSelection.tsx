import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShares } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import {
  ErrorContainer,
  ShareContainer,
  ShareInputContainer,
  ShareLink,
  ShareSelectionWrapper,
} from "./ShareSelection.style";
import AnimateHeight from "react-animate-height";
import { CauseArea } from "../../../../types/CauseArea";
import { ErrorText } from "../DonationPane";
import { ToolTip } from "../../../shared/ToolTip/ToolTip";

export const SharesSelection: React.FC<{
  causeArea: CauseArea;
  relevantErrorTexts: ErrorText[];
  open: boolean;
  scrollToWhenOpened: boolean;
}> = ({ causeArea, relevantErrorTexts, open, scrollToWhenOpened }) => {
  const dispatch = useDispatch();
  const organizations = causeArea.organizations;
  const distributionCauseAreas = useSelector(
    (state: State) => state.donation.distributionCauseAreas,
  );
  const [lastErrorTexts, setLastErrorTexts] = React.useState<ErrorText[]>([]);

  useEffect(() => {
    if (relevantErrorTexts.length > 0) {
      setLastErrorTexts(relevantErrorTexts);
    }
  }, [relevantErrorTexts]);

  const distributionCauseArea = distributionCauseAreas.find(
    (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
  );
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const hasError = relevantErrorTexts.length > 0 && lastErrorTexts.length > 0;

  useEffect(() => {
    if (open && scrollToWhenOpened) {
      setTimeout(() => {
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [open, scrollToWhenOpened, wrapperRef]);

  if (!distributionCauseArea) return <div>Ingen fordeling for saksområde</div>;
  if (!organizations) return <div>Ingen organisasjoner</div>;

  return (
    <ShareSelectionWrapper data-error={relevantErrorTexts[0]?.error.type}>
      <ShareContainer ref={wrapperRef}>
        {distributionCauseArea.organizations.map((org) => {
          const organization = organizations.find((o) => o.id === org.id);
          if (!organization) return null;
          return (
            <ShareInputContainer key={org.id}>
              <div>
                <ShareLink href={organization.informationUrl} target="_blank">
                  <label htmlFor={org.id.toString()}>{organization.widgetDisplayName}</label>
                </ShareLink>
                {organization.widgetContext && <ToolTip text={organization.widgetContext} />}
              </div>
              <input
                data-cy={`org-${org.id}`}
                type="tel"
                name={org.id.toString()}
                placeholder="0"
                value={org.percentageShare}
                onChange={(e) => {
                  const newOrganizationShares = [...distributionCauseArea.organizations];
                  const index = newOrganizationShares.map((s) => s.id).indexOf(org.id);

                  if (e.target.value === "") {
                    newOrganizationShares[index].percentageShare = "0";
                  } else if (Number.isInteger(parseInt(e.target.value))) {
                    const newSplit = parseInt(e.target.value);
                    if (newSplit <= 100 && newSplit >= 0) {
                      newOrganizationShares[index].percentageShare = newSplit.toString();
                    }
                  }

                  dispatch(setShares(distributionCauseArea.id, newOrganizationShares));
                }}
              />
            </ShareInputContainer>
          );
        })}
      </ShareContainer>
      <AnimateHeight height={hasError ? "auto" : 0} duration={300} animateOpacity>
        <ErrorContainer>
          {lastErrorTexts.map((errorText) => (
            <div key={errorText.error.type}>{errorText.text}</div>
          ))}
        </ErrorContainer>
      </AnimateHeight>
    </ShareSelectionWrapper>
  );
};

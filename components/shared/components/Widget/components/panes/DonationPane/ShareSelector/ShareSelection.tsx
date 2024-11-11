import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShares } from "../../../../store/donation/actions";
import { State } from "../../../../store/state";
import {
  ErrorContainer,
  PrefilledSharesWrapper,
  ShareContainer,
  ShareInputContainer,
  ShareLink,
  ShareSelectionWrapper,
  ShowAllOrganizations,
} from "./ShareSelection.style";
import AnimateHeight from "react-animate-height";
import { CauseArea } from "../../../../types/CauseArea";
import { ErrorText } from "../DonationPane";
import { ToolTip } from "../../../shared/ToolTip/ToolTip";
import { Organization } from "../../../../types/Organization";
import { DistributionCauseArea } from "../../../../types/DistributionCauseArea";
import { DistributionCauseAreaOrganization } from "../../../../types/DistributionCauseAreaOrganization";
import { WidgetContext } from "../../../../../../../main/layout/layout";

export const SharesSelection: React.FC<{
  causeArea: CauseArea;
  relevantErrorTexts: ErrorText[];
  open: boolean;
  scrollToWhenOpened: boolean;
}> = ({ causeArea, relevantErrorTexts, open, scrollToWhenOpened }) => {
  const organizations = causeArea.organizations;
  const distributionCauseAreas = useSelector(
    (state: State) => state.donation.distributionCauseAreas,
  );
  const [lastErrorTexts, setLastErrorTexts] = React.useState<ErrorText[]>([]);
  const [widgetContext, setWidgetContext] = React.useContext(WidgetContext);

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

  const prefilledShares = distributionCauseArea.organizations.filter((org) =>
    widgetContext.prefilled
      ?.find((causeArea) => causeArea.causeAreaId === distributionCauseArea.id)
      ?.organizations.find((o) => o.organizationId === org.id),
  );
  const nonPrefilledShares = distributionCauseArea.organizations.filter(
    (org) =>
      !widgetContext.prefilled
        ?.find((causeArea) => causeArea.causeAreaId === distributionCauseArea.id)
        ?.organizations.find((o) => o.organizationId === org.id),
  );

  return (
    <ShareSelectionWrapper data-error={relevantErrorTexts[0]?.error.type}>
      <div ref={wrapperRef}>
        <ShareList
          prefilledShares={prefilledShares}
          nonPrefilledShares={nonPrefilledShares}
          distributionCauseArea={distributionCauseArea}
          organizations={organizations}
        />
      </div>
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

const ShareList: React.FC<{
  prefilledShares: DistributionCauseAreaOrganization[];
  nonPrefilledShares: DistributionCauseAreaOrganization[];
  distributionCauseArea: DistributionCauseArea;
  organizations: Organization[];
}> = ({ prefilledShares, nonPrefilledShares, distributionCauseArea, organizations }) => {
  const [showNonPrefilledShares, setShowNonPrefilledShares] = useState(false);

  if (prefilledShares.length === 0) {
    return (
      <ShareContainer>
        {nonPrefilledShares.map((org) => {
          const organization = organizations.find((o) => o.id === org.id);
          if (!organization) return null;
          return (
            <ShareInput
              key={org.id}
              organization={organization}
              distributionCauseArea={distributionCauseArea}
              distributionCauseAreaOrganizations={org}
            />
          );
        })}
      </ShareContainer>
    );
  } else {
    return (
      <PrefilledSharesWrapper>
        <ShareContainer>
          {prefilledShares.map((org) => {
            const organization = organizations.find((o) => o.id === org.id);
            if (!organization) return null;
            return (
              <ShareInput
                key={org.id}
                organization={organization}
                distributionCauseArea={distributionCauseArea}
                distributionCauseAreaOrganizations={org}
              />
            );
          })}
        </ShareContainer>
        <ShowAllOrganizations
          onClick={() => setShowNonPrefilledShares(!showNonPrefilledShares)}
          open={showNonPrefilledShares}
          data-cy="show-all-organizations-button"
        >
          Vis alle
        </ShowAllOrganizations>

        <AnimateHeight height={showNonPrefilledShares ? "auto" : 0} duration={300} animateOpacity>
          <ShareContainer>
            {nonPrefilledShares.map((org) => {
              const organization = organizations.find((o) => o.id === org.id);
              if (!organization) return null;
              return (
                <ShareInput
                  key={org.id}
                  organization={organization}
                  distributionCauseArea={distributionCauseArea}
                  distributionCauseAreaOrganizations={org}
                />
              );
            })}
          </ShareContainer>
        </AnimateHeight>
      </PrefilledSharesWrapper>
    );
  }
};

const ShareInput: React.FC<{
  organization: Organization;
  distributionCauseArea: DistributionCauseArea;
  distributionCauseAreaOrganizations: DistributionCauseAreaOrganization;
}> = ({ organization, distributionCauseArea, distributionCauseAreaOrganizations }) => {
  const dispatch = useDispatch();

  return (
    <ShareInputContainer>
      <div>
        <ShareLink href={organization.informationUrl} target="_blank">
          <label htmlFor={organization.id.toString()}>{organization.widgetDisplayName}</label>
        </ShareLink>
        {organization.widgetContext && <ToolTip text={organization.widgetContext} />}
      </div>
      <input
        data-cy={`org-${organization.id}`}
        type="tel"
        name={organization.id.toString()}
        placeholder="0"
        value={distributionCauseAreaOrganizations.percentageShare}
        onChange={(e) => {
          const newOrganizationShares = [...distributionCauseArea.organizations];
          const index = newOrganizationShares.map((s) => s.id).indexOf(organization.id);

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
};

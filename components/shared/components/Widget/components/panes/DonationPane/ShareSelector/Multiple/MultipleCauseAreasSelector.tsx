import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../../store/state";
import {
  CauseAreaSelectionWrapper,
  CauseAreaShareSelectionTitle,
  CauseAreaShareSelectionTitleSmartDistributionWrapper,
  CauseAreaShareSelectionTitleWrapper,
  SmartDistributionExplanationWrapper,
  SmartDistributionLabel,
} from "./MultipleCauseAreasSelector.style";
import { Toggle } from "../../../../shared/Toggle/Toggle";
import { setCauseAreaPercentageShare, setShareType } from "../../../../../store/donation/actions";
import { SharesSelection } from "../ShareSelection";
import { Links } from "../../../../../../../../main/blocks/Links/Links";
import { SmartDistributionContext } from "../../../../../types/WidgetProps";
import { useState } from "react";
import { PortableText } from "@portabletext/react";
import AnimateHeight from "react-animate-height";
import { ErrorText } from "../../DonationPane";
import { filterErrorTextsForCauseArea } from "../../_util";

import { PercentageInput } from "../PercentageInput/PercentageInput";

export const MultipleCauseAreasSelector: React.FC<{
  configuration: SmartDistributionContext;
  errorTexts: ErrorText[];
}> = ({ configuration, errorTexts }) => {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const layout = useSelector((state: State) => state.layout);
  const donation = useSelector((state: State) => state.donation);
  const dispatch = useDispatch();

  if (!layout.causeAreas) return <span>No cause areas</span>;

  return (
    <>
      <SmartDistributionExplanationWrapper>
        <SmartDistributionLabel
          expanded={explanationOpen}
          onClick={() => setExplanationOpen(!explanationOpen)}
        >
          {configuration.smart_distribution_label_text}
        </SmartDistributionLabel>
        <AnimateHeight height={explanationOpen ? "auto" : 0} duration={200} animateOpacity>
          <PortableText value={configuration.smart_distribution_description} />
          <Links links={configuration.smart_distribution_description_links} />
        </AnimateHeight>
      </SmartDistributionExplanationWrapper>
      <div
        data-error={
          errorTexts.find((error) => error.error.type === "causeAreaSumError")?.error.type
        }
      >
        {layout.causeAreas.map((causeArea) => {
          const distributionCauseArea = donation.distributionCauseAreas.find(
            (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
          );

          if (!distributionCauseArea) return <div>Missing cause are distribution in state</div>;

          const standardSplit = distributionCauseArea.standardSplit;

          return (
            <CauseAreaSelectionWrapper
              key={causeArea.name}
              data-cy={"cause-area"}
              separated={causeArea.organizations.length == 1}
            >
              <CauseAreaShareSelectionTitleWrapper>
                <CauseAreaShareSelectionTitle>{causeArea.name}</CauseAreaShareSelectionTitle>
                {causeArea.organizations.length > 1 && (
                  <CauseAreaShareSelectionTitleSmartDistributionWrapper>
                    <span>Smart fordeling</span>
                    <Toggle
                      active={standardSplit}
                      dataCy="smart-distribution-toggle"
                      onChange={(checked) => {
                        if (checked) {
                          dispatch(setShareType(causeArea.id, true));
                        } else {
                          dispatch(setShareType(causeArea.id, false));
                        }
                      }}
                    />
                  </CauseAreaShareSelectionTitleSmartDistributionWrapper>
                )}
              </CauseAreaShareSelectionTitleWrapper>

              <PercentageInput
                causeArea={distributionCauseArea}
                onChange={(value) => {
                  dispatch(setCauseAreaPercentageShare(causeArea.id, value));
                }}
              />

              {causeArea.organizations.length > 1 && (
                <AnimateHeight height={!standardSplit ? "auto" : 0} duration={300} animateOpacity>
                  <SharesSelection
                    causeArea={causeArea}
                    open={!standardSplit}
                    relevantErrorTexts={filterErrorTextsForCauseArea(errorTexts, causeArea.id)}
                    scrollToWhenOpened
                  />
                </AnimateHeight>
              )}
            </CauseAreaSelectionWrapper>
          );
        })}
      </div>
    </>
  );
};

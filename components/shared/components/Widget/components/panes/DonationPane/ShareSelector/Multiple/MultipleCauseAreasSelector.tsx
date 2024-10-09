import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../../store/state";
import {
  CauseAreaSelectionWrapper,
  CauseAreaShareSelectionTitle,
  CauseAreaShareSelectionTitleSmartDistributionWrapper,
  CauseAreaShareSelectionTitleWrapper,
  PercentageInputWrapper,
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
import { ToolTip } from "../../../../shared/ToolTip/ToolTip";
import Link from "next/link";

export const MultipleCauseAreasSelector: React.FC<{
  configuration: SmartDistributionContext;
  errorTexts: ErrorText[];
}> = ({ configuration, errorTexts }) => {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const layout = useSelector((state: State) => state.layout);
  const donation = useSelector((state: State) => state.donation);
  const dispatch = useDispatch();

  const causeAreaSumError = errorTexts.find((error) => error.error.type === "causeAreaSumError")
    ?.error.type;

  if (!layout.causeAreas) return <span>No cause areas</span>;

  return (
    <>
      <SmartDistributionExplanationWrapper>
        <SmartDistributionLabel
          expanded={explanationOpen.toString()}
          onClick={() => setExplanationOpen(!explanationOpen)}
        >
          {configuration.smart_distribution_label_text}
        </SmartDistributionLabel>
        <AnimateHeight height={explanationOpen ? "auto" : 0} duration={200} animateOpacity>
          <PortableText value={configuration.smart_distribution_description} />
          <Links links={configuration.smart_distribution_description_links} />
        </AnimateHeight>
      </SmartDistributionExplanationWrapper>
      <div data-error={causeAreaSumError}>
        {layout.causeAreas.map((causeArea) => {
          const distributionCauseArea = donation.distributionCauseAreas.find(
            (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
          );

          if (!distributionCauseArea)
            return <div key={causeArea.name}>Missing cause are distribution in state</div>;

          const standardSplit = distributionCauseArea.standardSplit;

          return (
            <CauseAreaSelectionWrapper
              key={causeArea.name}
              data-cy={"cause-area"}
              separated={(causeArea.organizations.length == 1).toString()}
            >
              <CauseAreaShareSelectionTitleWrapper>
                <CauseAreaShareSelectionTitle>
                  <Link
                    href={causeArea.informationUrl}
                    target="_blank"
                    onClick={() => alert("Hello")}
                  >
                    {causeArea.widgetDisplayName || causeArea.name}
                  </Link>{" "}
                  {causeArea.widgetContext && (
                    <ToolTip text={causeArea.widgetContext} linkUrl={causeArea.informationUrl} />
                  )}
                </CauseAreaShareSelectionTitle>
                {causeArea.organizations.length > 1 && (
                  <CauseAreaShareSelectionTitleSmartDistributionWrapper>
                    <span>{configuration.smart_distribution_label_text}</span>
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

              <PercentageInputWrapper data-error={causeAreaSumError}>
                <span>
                  <input
                    type={"tel"}
                    placeholder="0"
                    value={distributionCauseArea.percentageShare}
                    onChange={(e) => {
                      let shareInput: string = distributionCauseArea.percentageShare;
                      if (e.target.value === "") {
                        shareInput = "0";
                      } else if (Number.isInteger(parseInt(e.target.value))) {
                        const newShare = parseInt(e.target.value);
                        if (newShare <= 100 && newShare >= 0) {
                          shareInput = newShare.toString();
                        }
                      }

                      dispatch(setCauseAreaPercentageShare(causeArea.id, shareInput));
                    }}
                  />
                </span>
              </PercentageInputWrapper>

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

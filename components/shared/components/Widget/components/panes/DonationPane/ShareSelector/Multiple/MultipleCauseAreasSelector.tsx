import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../../store/state";
import {
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
import Validator from "validator";

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
      {layout.causeAreas.map((causeArea) => {
        const distributionCauseArea = donation.distributionCauseAreas.find(
          (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
        );

        if (!distributionCauseArea) return <div>Missing cause are distribution in state</div>;

        const standardSplit = distributionCauseArea.standardSplit;

        return (
          <div key={causeArea.name} data-cy={"cause-area"}>
            <CauseAreaShareSelectionTitleWrapper>
              <CauseAreaShareSelectionTitle>{causeArea.name}</CauseAreaShareSelectionTitle>
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
            </CauseAreaShareSelectionTitleWrapper>

            <PercentageInputWrapper>
              <span>
                <input
                  type={"tel"}
                  placeholder="0"
                  value={distributionCauseArea.percentageShare}
                  onChange={(e) => {
                    let shareInput: string = distributionCauseArea.percentageShare;
                    if (e.target.value === "") {
                      shareInput = "0";
                    } else if (Validator.isInt(e.target.value)) {
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

            <AnimateHeight height={!standardSplit ? "auto" : 0} duration={300} animateOpacity>
              <SharesSelection
                causeArea={causeArea}
                open={!standardSplit}
                relevantErrorTexts={filterErrorTextsForCauseArea(errorTexts, causeArea.id)}
                scrollToWhenOpened
              />
            </AnimateHeight>
          </div>
        );
      })}
    </>
  );
};

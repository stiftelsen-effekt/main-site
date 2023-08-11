import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../../store/state";
import {
  CauseAreaShareSelectionTitle,
  CauseAreaShareSelectionTitleSmartDistributionWrapper,
  CauseAreaShareSelectionTitleWrapper,
  PercentageInputWrapper,
} from "./MultipleCauseAreasSelector.style";
import { Toggle } from "../../../../shared/Toggle/Toggle";
import { setCauseAreaPercentageShare, setShareType } from "../../../../../store/donation/actions";
import { SharesSelection } from "../ShareSelection";

export const MultipleCauseAreasSelector: React.FC = () => {
  const layout = useSelector((state: State) => state.layout);
  const donation = useSelector((state: State) => state.donation);
  const dispatch = useDispatch();

  if (!layout.causeAreas) return null;

  return (
    <>
      {layout.causeAreas.map((causeArea) => {
        const distributionCauseArea = donation.distributionCauseAreas.find(
          (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
        );

        if (!distributionCauseArea) return <div>Missing cause are distribution in state</div>;

        const standardSplit = distributionCauseArea.standardSplit;

        return (
          <div key={causeArea.name}>
            <CauseAreaShareSelectionTitleWrapper>
              <CauseAreaShareSelectionTitle>{causeArea.name}</CauseAreaShareSelectionTitle>
              <CauseAreaShareSelectionTitleSmartDistributionWrapper>
                <span>Smart fordeling</span>
                <Toggle
                  active={standardSplit}
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
                    dispatch(setCauseAreaPercentageShare(causeArea.id, e.target.value));
                  }}
                />
              </span>
            </PercentageInputWrapper>

            <SharesSelection causeArea={causeArea} open={!standardSplit} />
          </div>
        );
      })}
    </>
  );
};

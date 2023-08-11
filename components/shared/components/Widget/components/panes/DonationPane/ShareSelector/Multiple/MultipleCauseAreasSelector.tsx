import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../../store/state";
import {
  CauseAreaShareSelectionTitle,
  CauseAreaShareSelectionTitleSmartDistributionWrapper,
  CauseAreaShareSelectionTitleWrapper,
  PercentageInputWrapper,
} from "./MultipleCauseAreasSelector.style";
import { Toggle } from "../../../../shared/Toggle/Toggle";
import { setShareType } from "../../../../../store/donation/actions";
import { ShareType } from "../../../../../types/Enums";
import { SharesSelection } from "../ShareSelection";

export const MultipleCauseAreasSelector: React.FC = () => {
  const layout = useSelector((state: State) => state.layout);
  const donation = useSelector((state: State) => state.donation);
  const dispatch = useDispatch();

  if (!layout.causeAreas) return null;

  return (
    <>
      {layout.causeAreas.map((causeArea) => {
        const shareType = donation.shares.find(
          (shares) => shares.causeArea === causeArea.name,
        )?.shareType;

        return (
          <div key={causeArea.name}>
            <CauseAreaShareSelectionTitleWrapper>
              <CauseAreaShareSelectionTitle>{causeArea.name}</CauseAreaShareSelectionTitle>
              <CauseAreaShareSelectionTitleSmartDistributionWrapper>
                <span>Smart fordeling</span>
                <Toggle
                  active={
                    donation.shares.find((shares) => shares.causeArea === causeArea.name)
                      ?.shareType === ShareType.STANDARD
                  }
                  onChange={(checked) => {
                    if (checked) {
                      dispatch(setShareType(causeArea.name, ShareType.STANDARD));
                    } else {
                      dispatch(setShareType(causeArea.name, ShareType.CUSTOM));
                    }
                  }}
                />
              </CauseAreaShareSelectionTitleSmartDistributionWrapper>
            </CauseAreaShareSelectionTitleWrapper>

            <PercentageInputWrapper>
              <span>
                <input type={"tel"} placeholder="0" />
              </span>
            </PercentageInputWrapper>

            <SharesSelection causeArea={causeArea} open={shareType == ShareType.CUSTOM} />
          </div>
        );
      })}
    </>
  );
};

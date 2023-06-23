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
import AnimateHeight from "react-animate-height";
import { SharesSelection } from "../ShareSelection";
import { SharesSum } from "../SharesSum";
import { useRef } from "react";

export const MultipleCauseAreasSelector: React.FC = () => {
  const layout = useSelector((state: State) => state.layout);
  const donation = useSelector((state: State) => state.donation);
  const dispatch = useDispatch();

  if (!layout.causeAreas) return null;

  return (
    <>
      {layout.causeAreas.map((causeAreaOrgs) => {
        const shareType = donation.shares.find(
          (shares) => shares.causeArea === causeAreaOrgs.name,
        )?.shareType;

        return (
          <div key={causeAreaOrgs.name}>
            <CauseAreaShareSelectionTitleWrapper>
              <CauseAreaShareSelectionTitle>{causeAreaOrgs.name}</CauseAreaShareSelectionTitle>
              <CauseAreaShareSelectionTitleSmartDistributionWrapper>
                <span>Smart fordeling</span>
                <Toggle
                  active={
                    donation.shares.find((shares) => shares.causeArea === causeAreaOrgs.name)
                      ?.shareType === ShareType.CUSTOM
                  }
                  onChange={(checked) => {
                    if (checked) {
                      dispatch(setShareType(causeAreaOrgs.name, ShareType.CUSTOM));
                    } else {
                      dispatch(setShareType(causeAreaOrgs.name, ShareType.STANDARD));
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

            <SharesSelection causeAreaOrgs={causeAreaOrgs} open={shareType == ShareType.CUSTOM} />
          </div>
        );
      })}
    </>
  );
};

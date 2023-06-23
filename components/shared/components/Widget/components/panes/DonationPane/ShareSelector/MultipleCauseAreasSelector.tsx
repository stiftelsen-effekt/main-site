import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../store/state";
import {
  CauseAreaShareSelectionTitle,
  CauseAreaShareSelectionTitleSmartDistributionWrapper,
  CauseAreaShareSelectionTitleWrapper,
  PercentageInputWrapper,
} from "./MultipleCauseAreasSelector.style";
import { Toggle } from "../../../shared/Toggle/Toggle";
import { setShareType } from "../../../../store/donation/actions";
import { ShareType } from "../../../../types/Enums";
import AnimateHeight from "react-animate-height";
import { SharesSelection } from "./ShareSelection";
import { SharesSum } from "./SharesSum";
import { useRef } from "react";
import { TextInput } from "../../../shared/Input/TextInput";

export const MultipleCauseAreasSelector: React.FC = () => {
  const layout = useSelector((state: State) => state.layout);
  const donation = useSelector((state: State) => state.donation);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  if (!layout.causeAreas) return null;

  return (
    <>
      {layout.causeAreas.map((causeAreaOrgs) => {
        const shareType = donation.shares.find(
          (shares) => shares.causeArea === causeAreaOrgs.name,
        )?.shareType;

        return (
          <div key={causeAreaOrgs.name} ref={containerRef}>
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
                      // Smooth scroll to title when toggling to custom
                      setTimeout(() => {
                        containerRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }, 300);
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

            <AnimateHeight height={shareType == ShareType.CUSTOM ? "auto" : 0} animateOpacity>
              <SharesSelection causeAreaOrgs={causeAreaOrgs} />
              <SharesSum causeArea={causeAreaOrgs.name} />
            </AnimateHeight>
          </div>
        );
      })}
    </>
  );
};

import { useDispatch, useSelector } from "react-redux";
import { DistributionCauseArea } from "../../../../../types/DistributionCauseArea";
import { State } from "../../../../../store/state";
import {
  PercentageInputBalanceArrow,
  PercentageInputWrapper,
  PercentageInputWrapperShading,
} from "./PercentageInput.style";
import Validator from "validator";
import { setCauseAreaPercentageShare } from "../../../../../store/donation/actions";
import { useMemo, useState } from "react";
import { set } from "cypress/types/lodash";

export const PercentageInput: React.FC<{
  causeArea: DistributionCauseArea;
  onChange: (value: string) => void;
}> = ({ causeArea, onChange }) => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);
  const [previewBalancedLeft, setPreviewBalancedLeft] = useState<undefined | number>(undefined);

  const causeAreasSum = useMemo(
    () =>
      donation.distributionCauseAreas.reduce(
        (sum, causeArea) => sum + parseFloat(causeArea.percentageShare),
        0,
      ),
    [donation.distributionCauseAreas, causeArea.percentageShare],
  );

  const balancedLeft = useMemo(
    () => Math.max((parseFloat(causeArea.percentageShare) ?? 0) + (100 - causeAreasSum), 0),
    [causeArea.percentageShare, causeAreasSum],
  );

  return (
    <PercentageInputWrapper unbalanced={causeAreasSum !== 100}>
      <span>
        <input
          type={"tel"}
          placeholder="0"
          value={previewBalancedLeft ?? causeArea.percentageShare}
          onChange={(e) => {
            let shareInput: string = causeArea.percentageShare;
            if (e.target.value === "") {
              shareInput = "0";
            } else if (Validator.isInt(e.target.value)) {
              const newShare = parseInt(e.target.value);
              if (newShare <= 100 && newShare >= 0) {
                shareInput = newShare.toString();
              }
            }

            onChange(shareInput);
          }}
        />
        <PercentageInputWrapperShading
          percentage={previewBalancedLeft ?? parseFloat(causeArea.percentageShare) ?? 0}
        />
      </span>
      <PercentageInputBalanceArrow
        unbalanced={
          causeAreasSum !== 100 &&
          !(causeAreasSum > 100 && parseFloat(causeArea.percentageShare) === 0)
        }
        percentage={balancedLeft}
        onClick={(e) => {
          e.currentTarget.blur();
          dispatch(setCauseAreaPercentageShare(causeArea.id, balancedLeft.toString()));
        }}
        onMouseEnter={(e) => {
          setPreviewBalancedLeft(balancedLeft);
          e.currentTarget.style.outline = "none";
        }}
        onMouseLeave={(e) => {
          setPreviewBalancedLeft(undefined);
          e.currentTarget.style.outline = "";
        }}
        onMouseDown={(e) => e.currentTarget.blur()}
      >
        ↑
      </PercentageInputBalanceArrow>
    </PercentageInputWrapper>
  );
};

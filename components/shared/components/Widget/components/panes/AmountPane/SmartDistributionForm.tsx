import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { usePlausible } from "next-plausible";
import {
  FormWrapper,
  CauseAreaTitle,
  CauseAreaContext,
  TotalSumWrapper,
  SumWrapper,
  SumButtonsWrapper,
} from "../AmountPane.style";
import { MultipleCauseAreaIcon } from "../SelectionPane.style";
import { CauseArea } from "../../../types/CauseArea";
import { ShareType } from "../../../types/Enums";
import {
  setCauseAreaAmount,
  setCauseAreaDistributionType,
  setSmartDistributionTotal,
} from "../../../store/donation/actions";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { thousandize } from "../../../../../../../util/formatting";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import { State } from "../../../store/state";

interface SmartDistributionFormProps {
  suggestedSums: Array<{ amount: number; subtext?: string }>;
  totalAmount: number;
  causeAreas: CauseArea[];
  causeAreaAmounts: Record<number, number>;
  causeAreaDistributionType: Record<number, ShareType>;
  onTipStateChange: (wantsTip: boolean) => void;
  showOperationsOption?: boolean;
}

export const SmartDistributionForm: React.FC<SmartDistributionFormProps> = ({
  suggestedSums,
  totalAmount,
  causeAreas,
  causeAreaAmounts,
  causeAreaDistributionType,
  onTipStateChange,
}) => {
  const dispatch = useDispatch<any>();
  const plausible = usePlausible();

  // Get smart distribution total from Redux state
  const smartDistributionTotal =
    useSelector((state: State) => state.donation.smartDistributionTotal) || 0;

  const handleSuggestedSumClick = (suggestedAmount: number) => {
    plausible("SelectSuggestedSum", { props: { sum: suggestedAmount } });
    dispatch(setSmartDistributionTotal(suggestedAmount));

    let isTipExplicitlySetByStandardShare = false;
    let calculatedTipIfStandard = 0;
    let sumForTipCalculation = 0;

    // First pass: calculate sum for tip and see if tip is standard
    causeAreas.forEach((ca) => {
      if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
        if (ca.id !== 4) {
          // Operations cause area ID
          sumForTipCalculation += (ca.standardPercentageShare / 100) * suggestedAmount;
        }
      }
    });

    const operationsArea = causeAreas.find((ca) => ca.id === 4);
    if (
      operationsArea &&
      operationsArea.standardPercentageShare &&
      operationsArea.standardPercentageShare > 0
    ) {
      isTipExplicitlySetByStandardShare = true;
      calculatedTipIfStandard = (operationsArea.standardPercentageShare / 100) * suggestedAmount;
    }

    // Second pass: dispatch amounts
    causeAreas.forEach((ca) => {
      if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
        dispatch(
          setCauseAreaAmount(
            ca.id,
            Math.round((ca.standardPercentageShare / 100) * suggestedAmount),
          ),
        );
        dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
      }
    });

    // Update tip state based on whether the overall distribution matches 10%
    const finalOperationsAmount = causeAreaAmounts[4] || 0;
    const expectedTipAfterDistribution = Math.round((10 / 100) * sumForTipCalculation);

    if (isTipExplicitlySetByStandardShare) {
      if (calculatedTipIfStandard === expectedTipAfterDistribution) {
        onTipStateChange(true);
      } else {
        onTipStateChange(false);
      }
    } else {
      if (0 === expectedTipAfterDistribution) {
        onTipStateChange(true);
      } else {
        onTipStateChange(false);
      }
    }
  };

  const handleTotalAmountChange = (values: {
    floatValue: number | undefined;
    formattedValue: string;
    value: string;
  }) => {
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    dispatch(setSmartDistributionTotal(v));

    if (v > 0) {
      let sumForTipCalculation = 0;
      causeAreas.forEach((ca) => {
        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
          const amountForCA = Math.round((ca.standardPercentageShare / 100) * v);
          dispatch(setCauseAreaAmount(ca.id, amountForCA));
          dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
          if (ca.id !== 4) {
            sumForTipCalculation += amountForCA;
          }
        }
      });
      const finalOperationsAmount = causeAreaAmounts[4] || 0;
      const expectedTip = Math.round((10 / 100) * sumForTipCalculation);
      if (finalOperationsAmount === expectedTip) {
        onTipStateChange(true);
      } else {
        onTipStateChange(false);
      }
    } else {
      causeAreas.forEach((ca) => {
        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
          dispatch(setCauseAreaAmount(ca.id, 0));
          dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
        }
      });
      onTipStateChange(true);
    }
  };

  return (
    <FormWrapper>
      <div>
        <CauseAreaTitle>
          <MultipleCauseAreaIcon />
          Smart fördeling
        </CauseAreaTitle>
        <CauseAreaContext>
          Smart fördeling innebär att Ge Effektivt väljer ut de til enhver tid mest effektiva
          organisationerna för dig.
        </CauseAreaContext>
      </div>
      <div>
        <TotalSumWrapper>
          <SumButtonsWrapper>
            {suggestedSums.map((suggested) => (
              <div key={suggested.amount}>
                <EffektButton
                  variant={EffektButtonVariant.SECONDARY}
                  selected={smartDistributionTotal === suggested.amount}
                  onClick={() => handleSuggestedSumClick(suggested.amount)}
                  noMinWidth={true}
                  cy={`suggested-sum-smart-${suggested.amount}`}
                >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                {suggested.subtext && <i>{suggested.subtext}</i>}
              </div>
            ))}
          </SumButtonsWrapper>
          <SumWrapper>
            <span>
              <NumericFormat
                name="sum"
                thousandSeparator=" "
                allowNegative={false}
                decimalScale={0}
                type="tel"
                placeholder="0"
                value={smartDistributionTotal > 0 ? smartDistributionTotal : ""}
                autoComplete="off"
                data-cy="donation-sum-input-overall"
                onValueChange={handleTotalAmountChange}
              />
            </span>
          </SumWrapper>
        </TotalSumWrapper>
      </div>
    </FormWrapper>
  );
};

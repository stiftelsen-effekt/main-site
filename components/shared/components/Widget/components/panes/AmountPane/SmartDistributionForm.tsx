import React, { useState } from "react";
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
  ExplenationAccordion,
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
import { State } from "../../../store/state";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";

interface SmartDistributionFormProps {
  suggestedSums: Array<{ amount: number; subtext?: string }>;
  totalAmount: number;
  causeAreas: CauseArea[];
  causeAreaAmounts: Record<number, number>;
  causeAreaDistributionType: Record<number, ShareType>;
  showOperationsOption?: boolean;
}

export const SmartDistributionForm: React.FC<SmartDistributionFormProps> = ({
  suggestedSums,
  totalAmount,
  causeAreas,
  causeAreaAmounts,
  causeAreaDistributionType,
}) => {
  const dispatch = useDispatch<any>();
  const plausible = usePlausible();

  const [explenationOpen, setExplanationOpen] = useState(false);

  // Get smart distribution total from Redux state
  const smartDistributionTotal =
    useSelector((state: State) => state.donation.smartDistributionTotal) || 0;

  const handleSuggestedSumClick = (suggestedAmount: number) => {
    plausible("SelectSuggestedSum", { props: { sum: suggestedAmount } });
    dispatch(setSmartDistributionTotal(suggestedAmount));

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
    } else {
      causeAreas.forEach((ca) => {
        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
          dispatch(setCauseAreaAmount(ca.id, 0));
          dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
        }
      });
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
      <div>
        {/** Smart distribution current distribution accordion */}
        <ExplenationAccordion>
          <div onClick={() => setExplanationOpen(!explenationOpen)}>
            <span>Nuvärande fördelning</span>
            <ChevronDown
              size={28}
              style={{
                transform: explenationOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <AnimateHeight height={explenationOpen ? "auto" : 0}>
            <div>
              Nuvärenda fördelning är baserad på den senaste smarta fördelningen. Om du ändrar
              summan kommer den att uppdateras baserat på de senaste standardandelarna för varje
              sakområde.
            </div>
          </AnimateHeight>
        </ExplenationAccordion>
      </div>
    </FormWrapper>
  );
};

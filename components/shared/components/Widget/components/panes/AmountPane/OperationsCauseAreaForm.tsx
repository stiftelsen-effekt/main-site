import React from "react";
import { useDispatch } from "react-redux";
import { NumericFormat } from "react-number-format";
import {
  FormWrapper,
  CauseAreaTitle,
  CauseAreaContext,
  TotalSumWrapper,
  SumWrapper,
  SumButtonsWrapper,
} from "../AmountPane.style";

import { getCauseAreaIconById } from "../SelectionPane.style";
import { setCauseAreaAmount } from "../../../store/donation/actions";
import { usePlausible } from "next-plausible";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { thousandize } from "../../../../../../../util/formatting";
import { CauseAreaDisplayConfig } from "../../../types/WidgetProps";

interface OperationsCauseAreaFormProps {
  suggestedSums: Array<{ amount: number; subtext?: string }>;
  causeAreaAmounts: Record<number, number>;
  causeAreaDisplayConfig: CauseAreaDisplayConfig;
}

export const OperationsCauseAreaForm: React.FC<OperationsCauseAreaFormProps> = ({
  suggestedSums,
  causeAreaAmounts,
  causeAreaDisplayConfig,
}) => {
  const dispatch = useDispatch<any>();
  const plausible = usePlausible();

  return (
    <FormWrapper>
      <div>
        <CauseAreaTitle>
          {getCauseAreaIconById(4)}
          Drift
        </CauseAreaTitle>
        <CauseAreaContext>{getCauseAreaContext(4, causeAreaDisplayConfig)}</CauseAreaContext>
      </div>
      <div>
        <TotalSumWrapper>
          <SumButtonsWrapper>
            {suggestedSums.map((suggested) => (
              <div key={suggested.amount}>
                <EffektButton
                  variant={EffektButtonVariant.SECONDARY}
                  selected={causeAreaAmounts[4] === suggested.amount}
                  onClick={() => {
                    plausible("SelectSuggestedSum", { props: { sum: suggested.amount } });
                    dispatch(setCauseAreaAmount(4, suggested.amount));
                  }}
                  noMinWidth={true}
                >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                {suggested.subtext && <i>{suggested.subtext}</i>}
              </div>
            ))}
          </SumButtonsWrapper>
          <SumWrapper>
            <span>
              <NumericFormat
                name="sum-operations"
                type="tel"
                placeholder="0"
                thousandSeparator=" "
                value={causeAreaAmounts[4] > 0 ? causeAreaAmounts[4] : ""}
                autoComplete="off"
                data-cy="donation-sum-input-operations"
                onValueChange={(values) => {
                  const v = values.floatValue === undefined ? 0 : values.floatValue;
                  dispatch(setCauseAreaAmount(4, v));
                }}
                allowNegative={false}
                decimalScale={0}
              />
            </span>
          </SumWrapper>
        </TotalSumWrapper>
      </div>
    </FormWrapper>
  );
};

const getCauseAreaContext = (id: number, config?: CauseAreaDisplayConfig) => {
  const context = config?.cause_area_contexts?.find((c) => c.cause_area_id === id);
  return context?.context_text || null;
};

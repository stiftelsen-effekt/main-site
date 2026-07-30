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
import { setSmartDistributionTotal } from "../../../store/donation/actions";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { thousandize } from "../../../../../../../util/formatting";
import { State } from "../../../store/state";
import { CauseAreaDisplayConfig, SmartDistributionContext } from "../../../types/WidgetProps";
import { CauseAreaRollout } from "../../shared/CauseAreaRollout/CauseAreaRollout";

interface SmartDistributionFormProps {
  suggestedSums: Array<{ amount: number; subtext?: string }>;
  totalAmount: number;
  causeAreas: CauseArea[];
  causeAreaAmounts: Record<number, number>;
  causeAreaDistributionType: Record<number, ShareType>;
  showOperationsOption?: boolean;
  smartDistributionContext: SmartDistributionContext;
  causeAreaDisplayConfig: CauseAreaDisplayConfig;
}

export const SmartDistributionForm: React.FC<SmartDistributionFormProps> = ({
  suggestedSums,
  totalAmount,
  causeAreas,
  causeAreaAmounts,
  causeAreaDistributionType,
  causeAreaDisplayConfig,
  smartDistributionContext,
}) => {
  const dispatch = useDispatch<any>();
  const plausible = usePlausible();

  // Get smart distribution total from Redux state
  const smartDistributionTotal =
    useSelector((state: State) => state.donation.smartDistributionTotal) || 0;

  const handleSuggestedSumClick = (suggestedAmount: number) => {
    plausible("SelectSuggestedSum", { props: { sum: suggestedAmount } });
    dispatch(setSmartDistributionTotal(suggestedAmount));
  };

  const handleTotalAmountChange = (
    values: {
      floatValue: number | undefined;
      formattedValue: string;
      value: string;
    },
    sourceInfo: { source: string },
  ) => {
    // react-number-format also fires this on mount/reformat, not just on real
    // keystrokes - only a genuine user edit should overwrite the stored total.
    if (sourceInfo.source !== "event") return;
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    dispatch(setSmartDistributionTotal(v));
  };

  return (
    <FormWrapper>
      <div>
        <CauseAreaTitle>
          <MultipleCauseAreaIcon />
          {smartDistributionContext.smart_distribution_title}
        </CauseAreaTitle>
        <CauseAreaContext>{getCauseAreaContext(-1, causeAreaDisplayConfig)}</CauseAreaContext>
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
        <CauseAreaRollout
          causeAreaId={-1}
          config={causeAreaDisplayConfig}
          fallback={{
            label_text: smartDistributionContext.smart_distribution_label_text,
            description: smartDistributionContext.smart_distribution_description,
            links: smartDistributionContext.smart_distribution_description_links,
          }}
        />
      </div>
    </FormWrapper>
  );
};

const getCauseAreaContext = (id: number, config?: CauseAreaDisplayConfig) => {
  const context = config?.cause_area_contexts?.find((c) => c.cause_area_id === id);
  return context?.context_text || null;
};

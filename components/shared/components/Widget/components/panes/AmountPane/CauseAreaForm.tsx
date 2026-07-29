import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import Link from "next/link";
import { usePlausible } from "next-plausible";
import AnimateHeight from "react-animate-height";
import {
  FormWrapper,
  CauseAreaTitle,
  CauseAreaContext,
  TotalSumWrapper,
  SumWrapper,
  SumButtonsWrapper,
  InputList,
  OrganizationInputWrapper,
  OperationsPercentageInputWrapper,
} from "../AmountPane.style";
import { getCauseAreaIconById } from "../SelectionPane.style";
import { CauseArea } from "../../../types/CauseArea";
import { ShareType } from "../../../types/Enums";
import {
  setCauseAreaAmount,
  setOrgAmount,
  setCauseAreaDistributionType,
  setOperationsPercentageModeByCauseArea,
  setOperationsPercentageByCauseArea,
} from "../../../store/donation/actions";
import { thousandize } from "../../../../../../../util/formatting";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import {
  OperationsConfig,
  CauseAreaDisplayConfig,
  SmartDistributionContext,
} from "../../../types/WidgetProps";
import { InfoAccordion } from "../../shared/InfoAccordion/InfoAccordion";

interface CauseAreaFormProps {
  causeArea: CauseArea;
  isSingleSelection: boolean;
  suggestedSums: Array<{ amount: number; subtext?: string }>;
  causeAreaAmounts: Record<number, number>;
  orgAmounts: Record<number, number>;
  causeAreaDistributionType: Record<number, ShareType>;
  showOperationsOption?: boolean;
  operationsConfig?: OperationsConfig;
  causeAreaDisplayConfig?: CauseAreaDisplayConfig;
  smartDistributionContext: SmartDistributionContext;
}

export const CauseAreaForm: React.FC<CauseAreaFormProps> = ({
  causeArea,
  isSingleSelection,
  suggestedSums,
  causeAreaAmounts,
  orgAmounts,
  causeAreaDistributionType,
  showOperationsOption = false,
  operationsConfig,
  causeAreaDisplayConfig,
  smartDistributionContext,
}) => {
  const dispatch = useDispatch<any>();
  const plausible = usePlausible();
  const hasSingleOrg = causeArea.organizations.length <= 1;
  // "Andet"/"Annet" (other) - id 5, per DK_DEMO_CAUSE_AREAS in Widget.tsx and
  // the below-line/excluded-cause-area defaults in widgetDefaults.ts. Donors
  // here shouldn't be offered a smart/custom distribution choice; the amount
  // is always split via standard shares.
  const isOtherCauseArea = causeArea.id === 5;
  const hideDistributionToggle = hasSingleOrg || isOtherCauseArea;

  // Operations logic - now per cause area
  const currentCauseAreaAmount = causeAreaAmounts[causeArea.id] || 0;
  const {
    operationsPercentageModeByCauseArea = {},
    operationsPercentageByCauseArea = {},
    operationsConfig: stateConfig,
  } = useSelector((state: any) => state.donation);

  // Use config from props if available, otherwise from state
  const config = operationsConfig || stateConfig;
  const defaultPercentage = config?.defaultPercentage ?? 5;

  // Get percentage from Redux state
  const currentPercentage = operationsPercentageByCauseArea[causeArea.id] ?? defaultPercentage;

  // Check if operations are enabled for this cause area
  const isOperationsEnabled = operationsPercentageModeByCauseArea[causeArea.id] ?? false;

  // Internal state for input handling - always shows the full amount the user entered
  const [inputValue, setInputValue] = React.useState(currentCauseAreaAmount);

  // Sync input value with stored amount when it changes externally
  React.useEffect(() => {
    setInputValue(currentCauseAreaAmount);
  }, [currentCauseAreaAmount]);

  const handleCutToggle = (checked: boolean) => {
    dispatch(setOperationsPercentageModeByCauseArea(causeArea.id, checked));
  };

  const handlePercentageChange = (
    values: { floatValue: number | undefined },
    sourceInfo: { source: string },
  ) => {
    // react-number-format also fires this when `value` changes because the default
    // percentage prop mounts/updates, not just on real keystrokes - only a genuine
    // user edit should record an operations percentage for this cause area.
    if (sourceInfo.source !== "event") return;
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    // Limit percentage to 0-100
    const limitedPercentage = Math.min(Math.max(v, 0), 100);
    dispatch(setOperationsPercentageByCauseArea(causeArea.id, limitedPercentage));
  };

  const handleAmountChange = (
    values: { floatValue: number | undefined },
    sourceInfo: { source: string },
  ) => {
    // react-number-format also fires this when `value` changes because of a fresh
    // mount/reformat (e.g. switching from single to multiple cause area mode remounts
    // this form), not just on real keystrokes - only a genuine user edit should
    // overwrite the stored amount, or a stale/zero value silently clobbers it.
    if (sourceInfo.source !== "event") return;
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    setInputValue(v);

    // Always store the full amount entered by the user
    dispatch(setCauseAreaAmount(causeArea.id, v));

    if (hasSingleOrg) {
      dispatch(setOrgAmount(causeArea.organizations[0].id, v));
    }
  };

  const handleSuggestedSumClick = (amount: number) => {
    plausible("SelectSuggestedSum", { props: { sum: amount } });
    setInputValue(amount);

    // Always store the full amount
    dispatch(setCauseAreaAmount(causeArea.id, amount));

    if (hasSingleOrg) {
      dispatch(setOrgAmount(causeArea.organizations[0].id, amount));
    }
  };

  return (
    <FormWrapper key={causeArea.id}>
      <div>
        <CauseAreaTitle>
          {getCauseAreaIconById(causeArea.id)}
          {causeArea.widgetDisplayName || causeArea.name}
        </CauseAreaTitle>
        {getCauseAreaContext(causeArea.id, causeAreaDisplayConfig) && (
          <CauseAreaContext>
            {getCauseAreaContext(causeArea.id, causeAreaDisplayConfig)}
          </CauseAreaContext>
        )}
      </div>
      <div>
        {hideDistributionToggle ? (
          <TotalSumWrapper>
            {isSingleSelection && (
              <SumButtonsWrapper>
                {suggestedSums.map((suggested) => (
                  <div key={suggested.amount}>
                    <EffektButton
                      variant={EffektButtonVariant.SECONDARY}
                      selected={inputValue === suggested.amount}
                      onClick={() => handleSuggestedSumClick(suggested.amount)}
                      noMinWidth={true}
                      data-cy={`suggested-sum-${causeArea.id}-${suggested.amount}`}
                    >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                    {suggested.subtext && <i>{suggested.subtext}</i>}
                  </div>
                ))}
              </SumButtonsWrapper>
            )}
            <SumWrapper>
              <span>
                <NumericFormat
                  name={`sum-${causeArea.id}`}
                  thousandSeparator=" "
                  allowNegative={false}
                  decimalScale={0}
                  type="tel"
                  placeholder="0"
                  value={inputValue > 0 ? inputValue : ""}
                  autoComplete="off"
                  data-cy={`donation-sum-input-${causeArea.id}`}
                  onValueChange={handleAmountChange}
                />
              </span>
            </SumWrapper>
          </TotalSumWrapper>
        ) : (
          <>
            <AnimateHeight
              height={
                causeAreaDistributionType[causeArea.id] === ShareType.STANDARD ||
                causeAreaDistributionType[causeArea.id] === undefined
                  ? "auto"
                  : 0
              }
              animateOpacity
              duration={300}
            >
              <div style={{ paddingBottom: "30px" }}>
                <TotalSumWrapper>
                  {isSingleSelection && (
                    <SumButtonsWrapper>
                      {suggestedSums.map((suggested) => (
                        <div key={suggested.amount}>
                          <EffektButton
                            variant={EffektButtonVariant.SECONDARY}
                            selected={inputValue === suggested.amount}
                            onClick={() => handleSuggestedSumClick(suggested.amount)}
                            noMinWidth={true}
                            data-cy={`suggested-sum-${causeArea.id}-${suggested.amount}`}
                          >{`${
                            suggested.amount ? thousandize(suggested.amount) : "-"
                          } kr`}</EffektButton>
                          {suggested.subtext && <i>{suggested.subtext}</i>}
                        </div>
                      ))}
                    </SumButtonsWrapper>
                  )}
                  <SumWrapper>
                    <span>
                      <NumericFormat
                        name={`sum-${causeArea.id}`}
                        type="tel"
                        placeholder="0"
                        thousandSeparator=" "
                        value={inputValue > 0 ? inputValue : ""}
                        allowNegative={false}
                        step={1}
                        decimalScale={0}
                        autoComplete="off"
                        data-cy={`donation-sum-input-${causeArea.id}`}
                        onValueChange={handleAmountChange}
                      />
                    </span>
                  </SumWrapper>
                </TotalSumWrapper>
              </div>
            </AnimateHeight>
            <RadioButtonGroup
              options={[
                {
                  title: smartDistributionContext.smart_distribution_radiobutton_text,
                  value: ShareType.STANDARD,
                  data_cy: `radio-smart-share-${causeArea.id}`,
                },
                {
                  title: smartDistributionContext.custom_distribution_radiobutton_text,
                  value: ShareType.CUSTOM,
                  data_cy: `radio-custom-share-${causeArea.id}`,
                  content: (
                    <InputList>
                      {causeArea.organizations
                        .filter((o) => o.isActive)
                        .sort((o1, o2) => o1.ordering - o2.ordering)
                        .map((org) => (
                          <OrganizationInputWrapper key={org.id}>
                            <Link href={org.informationUrl || "#"}>
                              <label htmlFor={`org-${org.id}`}>
                                {org.widgetDisplayName || org.name}
                              </label>
                            </Link>
                            <span>
                              <NumericFormat
                                id={`org-${org.id}`}
                                type="tel"
                                placeholder="0"
                                value={orgAmounts[org.id] || ""}
                                step={1}
                                decimalScale={0}
                                allowNegative={false}
                                thousandSeparator=" "
                                autoComplete="off"
                                data-cy={`org-${org.id}`}
                                onValueChange={(values, sourceInfo) => {
                                  // Same react-number-format phantom-onValueChange-on-mount
                                  // guard as handleAmountChange/handlePercentageChange above.
                                  if (sourceInfo.source !== "event") return;
                                  const v = values.floatValue === undefined ? 0 : values.floatValue;
                                  dispatch(setOrgAmount(org.id, v));
                                }}
                              />
                            </span>
                          </OrganizationInputWrapper>
                        ))}
                    </InputList>
                  ),
                },
              ]}
              selected={causeAreaDistributionType[causeArea.id] ?? ShareType.STANDARD}
              onSelect={(val: ShareType) => {
                dispatch(setCauseAreaDistributionType(causeArea.id, val));
                if (val === ShareType.CUSTOM) {
                  const hasSetOrgAmounts =
                    Object.entries(orgAmounts).filter(([key, value]) => {
                      const orgId = parseInt(key);
                      return value > 0 && causeArea.organizations.some((org) => org.id === orgId);
                    }).length > 0;
                  if (!hasSetOrgAmounts) {
                    const causeAreaAmount = causeAreaAmounts[causeArea.id] || 0;
                    for (const org of causeArea.organizations) {
                      if (!org.standardShare) continue;
                      const orgShare = Math.round((org.standardShare / 100) * causeAreaAmount);
                      dispatch(setOrgAmount(org.id, orgShare));
                    }
                  }
                }
              }}
            />
          </>
        )}
      </div>

      {/* Operations option */}
      {showOperationsOption && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckBoxWrapper>
              <HiddenCheckBox
                type="checkbox"
                checked={isOperationsEnabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCutToggle(e.target.checked)
                }
                data-cy={`cut-checkbox-${causeArea.id}`}
              />
              <CustomCheckBox checked={isOperationsEnabled} label="" />
            </CheckBoxWrapper>
            <OperationsPercentageInputWrapper>
              <span>
                <NumericFormat
                  name={`percentage-cut-${causeArea.id}`}
                  allowNegative={false}
                  decimalScale={1}
                  max={100}
                  type="tel"
                  placeholder="5"
                  value={currentPercentage}
                  autoComplete="off"
                  data-cy={`percentage-cut-input-${causeArea.id}`}
                  onValueChange={handlePercentageChange}
                  disabled={!isOperationsEnabled}
                />
              </span>
              <span>
                {operationsConfig?.operations_label_template?.replace("{percentage}", "")}
              </span>
            </OperationsPercentageInputWrapper>
          </div>
        </div>
      )}

      {isOtherCauseArea && causeAreaDisplayConfig?.other_cause_area_info?.label_text && (
        <InfoAccordion
          labelText={causeAreaDisplayConfig.other_cause_area_info.label_text}
          description={causeAreaDisplayConfig.other_cause_area_info.description}
          link={causeAreaDisplayConfig.other_cause_area_info.link}
        />
      )}
    </FormWrapper>
  );
};

const getCauseAreaContext = (id: number, config?: CauseAreaDisplayConfig) => {
  const context = config?.cause_area_contexts?.find((c) => c.cause_area_id === id);
  return context?.context_text || null;
};

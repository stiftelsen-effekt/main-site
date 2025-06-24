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

interface CauseAreaFormProps {
  causeArea: CauseArea;
  isSingleSelection: boolean;
  suggestedSums: Array<{ amount: number; subtext?: string }>;
  causeAreaAmounts: Record<number, number>;
  orgAmounts: Record<number, number>;
  causeAreaDistributionType: Record<number, ShareType>;
  showOperationsOption?: boolean;
}

export const CauseAreaForm: React.FC<CauseAreaFormProps> = ({
  causeArea,
  isSingleSelection,
  suggestedSums,
  causeAreaAmounts,
  orgAmounts,
  causeAreaDistributionType,
  showOperationsOption = false,
}) => {
  const dispatch = useDispatch<any>();
  const plausible = usePlausible();
  const hasSingleOrg = causeArea.organizations.length === 1;

  // Operations logic - now per cause area
  const DEFAULT_CUT_PERCENTAGE = 5;
  const currentCauseAreaAmount = causeAreaAmounts[causeArea.id] || 0;
  const operationsPercentageModeByCauseArea =
    useSelector((state: any) => state.donation.operationsPercentageModeByCauseArea) || {};
  const operationsPercentageByCauseArea =
    useSelector((state: any) => state.donation.operationsPercentageByCauseArea) || {};

  // Get percentage from Redux state (defaults to 5% if not set)
  const currentPercentage = operationsPercentageByCauseArea[causeArea.id] ?? DEFAULT_CUT_PERCENTAGE;
  // Check if operations are enabled for this cause area
  const isOperationsEnabled = operationsPercentageModeByCauseArea[causeArea.id] === true;

  // Internal state for input handling - always shows the full amount the user entered
  const [inputValue, setInputValue] = React.useState(currentCauseAreaAmount);

  // Sync input value with stored amount when it changes externally
  React.useEffect(() => {
    setInputValue(currentCauseAreaAmount);
  }, [currentCauseAreaAmount]);

  const handleCutToggle = (checked: boolean) => {
    dispatch(setOperationsPercentageModeByCauseArea(causeArea.id, checked));
  };

  const handlePercentageChange = (values: { floatValue: number | undefined }) => {
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    // Limit percentage to 0-100
    const limitedPercentage = Math.min(Math.max(v, 0), 100);
    dispatch(setOperationsPercentageByCauseArea(causeArea.id, limitedPercentage));
  };

  const handleAmountChange = (values: { floatValue: number | undefined }) => {
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
        {getCauseAreaContextById(causeArea.id) && (
          <CauseAreaContext>{getCauseAreaContextById(causeArea.id)}</CauseAreaContext>
        )}
      </div>
      <div>
        {hasSingleOrg ? (
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
                  title: "Låt Ge Effektivt valja organisasjoner",
                  value: ShareType.STANDARD,
                },
                {
                  title: "Velj organisasjoner selv",
                  value: ShareType.CUSTOM,
                  content: (
                    <InputList>
                      {causeArea.organizations
                        .filter((o) => o.isActive)
                        .sort((o1, o2) => o1.ordering - o2.ordering)
                        .map((org) => (
                          <OrganizationInputWrapper key={org.id}>
                            <Link href={org.informationUrl || "#"} target="_blank">
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
                                onValueChange={(values) => {
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
              <span>% till drift av Ge Effektivt</span>
            </OperationsPercentageInputWrapper>
          </div>
        </div>
      )}
    </FormWrapper>
  );
};

const getCauseAreaContextById = (id: number) => {
  switch (id) {
    case 4:
      return "För värje krone til drift forventar vi att samla inn minst 10 krone till ändamål.";
    case 5:
      return "Överföringar till andra organisationer efter överenskommelse med Ge Effektivt.";
    default:
      return null;
  }
};

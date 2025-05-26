import React from "react";
import { useDispatch } from "react-redux";
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
} from "../AmountPane.style";
import { getCauseAreaIconById } from "../SelectionPane.style";
import { CauseArea } from "../../../types/CauseArea";
import { ShareType } from "../../../types/Enums";
import {
  setCauseAreaAmount,
  setOrgAmount,
  setCauseAreaDistributionType,
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

  // Operations logic
  const OPERATIONS_CAUSE_AREA_ID = 4;
  const TIP_PERCENTAGE = 5;
  const currentCauseAreaAmount = causeAreaAmounts[causeArea.id] || 0;
  const operationsAmount = causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0;

  // Derive state from Redux store to maintain persistence across navigation
  const totalIntendedAmount = currentCauseAreaAmount + operationsAmount;
  const userWantsTip = operationsAmount > 0 && totalIntendedAmount > 0;
  const tipAmount = operationsAmount;
  const actualCauseAreaAmount = currentCauseAreaAmount;

  // Internal state for input handling
  const [inputValue, setInputValue] = React.useState(totalIntendedAmount);

  // Sync input value with derived total when amounts change externally
  React.useEffect(() => {
    setInputValue(totalIntendedAmount);
  }, [totalIntendedAmount]);

  const handleTipToggle = (checked: boolean) => {
    const currentTotal = inputValue || 0;
    if (checked && currentTotal > 0) {
      const newTipAmount = Math.round((TIP_PERCENTAGE / 100) * currentTotal);
      const newCauseAreaAmount = currentTotal - newTipAmount;

      dispatch(setCauseAreaAmount(causeArea.id, newCauseAreaAmount));
      dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, newTipAmount));

      if (hasSingleOrg) {
        dispatch(setOrgAmount(causeArea.organizations[0].id, newCauseAreaAmount));
      }
    } else {
      // When unchecking, give the full amount to the cause area
      dispatch(setCauseAreaAmount(causeArea.id, currentTotal));
      dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, 0));

      if (hasSingleOrg) {
        dispatch(setOrgAmount(causeArea.organizations[0].id, currentTotal));
      }
    }
  };

  const handleAmountChange = (values: { floatValue: number | undefined }) => {
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    setInputValue(v);

    if (showOperationsOption) {
      // If tip is enabled, calculate the split
      if (userWantsTip && v > 0) {
        const newTipAmount = Math.round((TIP_PERCENTAGE / 100) * v);
        const newCauseAreaAmount = v - newTipAmount;

        dispatch(setCauseAreaAmount(causeArea.id, newCauseAreaAmount));
        dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, newTipAmount));

        if (hasSingleOrg) {
          dispatch(setOrgAmount(causeArea.organizations[0].id, newCauseAreaAmount));
        }
      } else {
        // If tip is not enabled, all goes to cause area
        dispatch(setCauseAreaAmount(causeArea.id, v));
        dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, 0));

        if (hasSingleOrg) {
          dispatch(setOrgAmount(causeArea.organizations[0].id, v));
        }
      }
    } else {
      // If operations option is not shown, just update normally
      dispatch(setCauseAreaAmount(causeArea.id, v));
      if (hasSingleOrg) {
        dispatch(setOrgAmount(causeArea.organizations[0].id, v));
      }
    }
  };

  const handleSuggestedSumClick = (amount: number) => {
    plausible("SelectSuggestedSum", { props: { sum: amount } });
    setInputValue(amount);

    if (showOperationsOption) {
      // If tip is enabled, calculate the split
      if (userWantsTip && amount > 0) {
        const newTipAmount = Math.round((TIP_PERCENTAGE / 100) * amount);
        const newCauseAreaAmount = amount - newTipAmount;

        dispatch(setCauseAreaAmount(causeArea.id, newCauseAreaAmount));
        dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, newTipAmount));

        if (hasSingleOrg) {
          dispatch(setOrgAmount(causeArea.organizations[0].id, newCauseAreaAmount));
        }
      } else {
        // If tip is not enabled, all goes to cause area
        dispatch(setCauseAreaAmount(causeArea.id, amount));
        dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, 0));

        if (hasSingleOrg) {
          dispatch(setOrgAmount(causeArea.organizations[0].id, amount));
        }
      }
    } else {
      // If operations option is not shown, just update normally
      dispatch(setCauseAreaAmount(causeArea.id, amount));
      if (hasSingleOrg) {
        dispatch(setOrgAmount(causeArea.organizations[0].id, amount));
      }
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
                      selected={
                        showOperationsOption
                          ? inputValue === suggested.amount
                          : causeAreaAmounts[causeArea.id] === suggested.amount
                      }
                      onClick={() => handleSuggestedSumClick(suggested.amount)}
                      noMinWidth={true}
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
                  value={
                    showOperationsOption
                      ? inputValue > 0
                        ? inputValue
                        : ""
                      : causeAreaAmounts[causeArea.id] > 0
                      ? causeAreaAmounts[causeArea.id]
                      : ""
                  }
                  autoComplete="off"
                  data-cy="donation-sum-input"
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
                            selected={
                              showOperationsOption
                                ? inputValue === suggested.amount
                                : causeAreaAmounts[causeArea.id] === suggested.amount
                            }
                            onClick={() => handleSuggestedSumClick(suggested.amount)}
                            noMinWidth={true}
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
                        value={
                          showOperationsOption
                            ? inputValue > 0
                              ? inputValue
                              : ""
                            : causeAreaAmounts[causeArea.id] > 0
                            ? causeAreaAmounts[causeArea.id]
                            : ""
                        }
                        allowNegative={false}
                        step={1}
                        decimalScale={0}
                        autoComplete="off"
                        data-cy="donation-sum-input"
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

        {/* Operations option */}
        {showOperationsOption && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <CheckBoxWrapper>
              <HiddenCheckBox
                type="checkbox"
                checked={userWantsTip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleTipToggle(e.target.checked)
                }
                data-cy="tip-checkbox"
              />
              <CustomCheckBox
                checked={userWantsTip}
                label={`Tip ${TIP_PERCENTAGE}% til drift av Ge Effektivt`}
              />
            </CheckBoxWrapper>
            {userWantsTip && inputValue > 0 && (
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
                {TIP_PERCENTAGE}% av {thousandize(inputValue)} kr = {thousandize(tipAmount)} kr til
                drift
                <br />
                <small style={{ color: "#888" }}>
                  {thousandize(actualCauseAreaAmount)} kr går till {causeArea.name},{" "}
                  {thousandize(tipAmount)} kr till drift
                </small>
              </div>
            )}
          </div>
        )}
      </div>
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

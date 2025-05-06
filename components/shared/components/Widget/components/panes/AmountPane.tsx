import React, { useEffect, useId, useState, useMemo } from "react"; // Added useState, useMemo
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "./Panes.style";
import { NextButton } from "../shared/Buttons/NavigationButtons";
import { DonationError, State } from "../../store/state";
import {
  setCauseAreaAmount,
  setOrgAmount,
  setSum,
  setRecurring,
  setCauseAreaDistributionType,
} from "../../store/donation/actions";
import { nextPane } from "../../store/layout/actions";
import { RadioButtonGroup } from "../../../RadioButton/RadioButtonGroup";
import { RecurringDonation, ShareType } from "../../types/Enums";
import {
  ActionBar,
  CauseAreaContext,
  CauseAreasWrapper,
  CauseAreaTitle,
  FormWrapper,
  InputList,
  OrganizationInputWrapper,
  RecurringSelectionWrapper,
  SumButtonsWrapper,
  SumWrapper,
  TotalAmountWrapper,
  TotalSumWrapper,
} from "./AmountPane.style";
import { AmountContext } from "../../types/WidgetProps";
import { EffektButton, EffektButtonVariant } from "../../../EffektButton/EffektButton";
import { thousandize } from "../../../../../../util/formatting";
import { usePlausible } from "next-plausible";
import { CauseArea } from "../../types/CauseArea";
import { getCauseAreaIconById, MultipleCauseAreaIcon } from "./SelectionPane.style";
import AnimateHeight from "react-animate-height";
import Link from "next/link";
import { NumericFormat } from "react-number-format"; // Added OnValueChangeData
import { CheckBoxWrapper, HiddenCheckBox } from "./Forms.style";
import { CustomCheckBox } from "./DonorPane/CustomCheckBox";

const TIP_PERCENTAGE = 10;
const OPERATIONS_CAUSE_AREA_ID = 4; // Define for clarity

/**
 * Second pane: enter NOK amounts per cause area or per organization.
 */
export const AmountPane: React.FC<{
  nextButtonText: string;
  smartDistContext: {
    smart_distribution_radiobutton_text: string;
    custom_distribution_radiobutton_text: string;
  };
  text: { single_donation_text: string; monthly_donation_text: string };
  enableRecurring: boolean;
  enableSingle: boolean;
  amountContext: AmountContext;
}> = ({ nextButtonText, smartDistContext, text, enableRecurring, enableSingle, amountContext }) => {
  const dispatch = useDispatch<any>();
  const {
    selectionType,
    selectedCauseAreaId,
    causeAreaAmounts = {},
    orgAmounts = {},
    causeAreaDistributionType = {},
    recurring,
  } = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];
  const plausible = usePlausible();

  // State to manage user's intent for the 10% tip
  const [userWants10PercentTip, setUserWants10PercentTip] = useState(false);
  // State to ensure initialization effect runs only once after amounts are loaded
  const [hasInitializedTipState, setHasInitializedTipState] = useState(false);

  // Calculate the sum of all donations EXCLUDING the operations tip
  const sumOfOtherCauseAreas = useMemo(() => {
    // Iterate over the keys present in causeAreaAmounts, which represent cause areas with some value.
    // However, for custom distribution, the actual sum comes from orgAmounts.
    // It might be more robust to iterate over `causeAreas` that are active in the selection,
    // but to minimally change your existing structure iterating Object.entries(causeAreaAmounts):

    return Object.keys(causeAreaAmounts).reduce((acc, key) => {
      const causeAreaId = parseInt(key);

      // Filter 1: Skip if this is the operations cause area itself.
      if (causeAreaId === OPERATIONS_CAUSE_AREA_ID) {
        return acc;
      }

      // Filter 2: Your existing filter for 'single' selection mode.
      // If in single selection mode, only consider the currently selected cause area
      // (unless it was already filtered out by being the operations area).
      if (selectionType === "single" && selectedCauseAreaId !== causeAreaId) {
        return acc;
      }

      let amountForThisCauseArea = 0;
      // Check the distribution type for this cause area.
      if (causeAreaDistributionType[causeAreaId] === ShareType.CUSTOM) {
        // If custom, sum its organization amounts.
        // We need the `causeAreas` array to find the specific cause area by ID and then its organizations.
        const currentCauseArea = causeAreas.find((ca) => ca.id === causeAreaId);
        if (currentCauseArea) {
          amountForThisCauseArea = currentCauseArea.organizations.reduce((orgSum, org) => {
            return orgSum + (Number(orgAmounts[org.id]) || 0);
          }, 0);
        }
        // If ShareType is CUSTOM but currentCauseArea is not found (should not happen if data is consistent),
        // or if it has no organizations, amountForThisCauseArea will remain 0 for this causeAreaId.
      } else {
        // If standard (or undefined distribution type, which defaults to standard),
        // use the value directly from causeAreaAmounts for this causeAreaId.
        amountForThisCauseArea = Number(causeAreaAmounts[causeAreaId]) || 0;
      }

      return acc + amountForThisCauseArea;
    }, 0);
  }, [
    causeAreaAmounts,
    causeAreaDistributionType,
    orgAmounts,
    causeAreas,
    selectionType,
    selectedCauseAreaId,
    // OPERATIONS_CAUSE_AREA_ID is a module-level constant, so it doesn't need to be in the dependency array.
    // ShareType.CUSTOM is an enum/constant, so it also doesn't need to be in the dependency array.
  ]);

  // Helper to compute total amount (as it was, sum of all including tip)
  const totalAmount = React.useMemo(() => {
    // This calculation sums up all values in causeAreaAmounts for relevant areas,
    // and orgAmounts if custom distribution is used.
    // It naturally includes the operations tip if it's in causeAreaAmounts.
    let currentTotal = 0;
    if (selectedCauseAreaId === -1) {
      // Overall smart distribution
      // Sum amounts for cause areas with standard percentage share
      // This mode typically sets amounts directly, including operations if it's part of standard shares.
      // However, the original code here sums up `causeAreaAmounts` or `orgAmounts` based on `causeAreaDistributionType`
      // for *all* cause areas.
      currentTotal = causeAreas.reduce((acc, area) => {
        if (
          causeAreaDistributionType[area.id] === ShareType.CUSTOM &&
          area.id !== OPERATIONS_CAUSE_AREA_ID
        ) {
          // Exclude ops if custom, sum orgs
          return (
            acc + area.organizations.reduce((orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0), 0)
          );
        }
        // For standard share or if it's the operations cause area, take its direct amount
        return acc + (causeAreaAmounts[area.id] || 0);
      }, 0);
    } else if (selectionType === "multiple") {
      currentTotal = causeAreas
        .filter((ca) => ca.id !== 5) // Assuming 5 is "other organizations" not relevant here
        .reduce((acc, area) => {
          if (
            causeAreaDistributionType[area.id] === ShareType.CUSTOM &&
            area.id !== OPERATIONS_CAUSE_AREA_ID
          ) {
            return (
              acc +
              area.organizations.reduce((orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0), 0)
            );
          }
          return acc + (causeAreaAmounts[area.id] || 0);
        }, 0);
    } else if (selectionType === "single" && selectedCauseAreaId != null) {
      const selectedArea = causeAreas.find((area) => area.id === selectedCauseAreaId);
      if (selectedArea) {
        if (causeAreaDistributionType[selectedCauseAreaId] === ShareType.STANDARD) {
          currentTotal += causeAreaAmounts[selectedCauseAreaId] || 0;
        } else {
          currentTotal += selectedArea.organizations.reduce(
            (orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0),
            0,
          );
        }
      }
      // Add operations tip separately for single cause area selection as it's always shown
      currentTotal += causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0;
    }
    return currentTotal;
  }, [
    causeAreaAmounts,
    orgAmounts,
    selectionType,
    selectedCauseAreaId,
    causeAreas,
    causeAreaDistributionType,
  ]);

  // Effect to initialize userWants10PercentTip based on loaded causeAreaAmounts
  useEffect(() => {
    if (!hasInitializedTipState && Object.keys(causeAreaAmounts).length > 0) {
      const currentOperationsAmount = causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0;
      const expectedTip = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);

      if (currentOperationsAmount === expectedTip) {
        setUserWants10PercentTip(true);
      } else {
        setUserWants10PercentTip(false);
      }
      setHasInitializedTipState(true);
    }
  }, [causeAreaAmounts, sumOfOtherCauseAreas, hasInitializedTipState]);

  // Effect to apply the 10% tip if userWants10PercentTip is true
  useEffect(() => {
    if (userWants10PercentTip) {
      const newTipAmount = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);
      if ((causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0) !== newTipAmount) {
        dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, newTipAmount));
      }
    }
    // If userWants10PercentTip is false, we don't automatically set tip to 0 here,
    // because it might be false due to a manual input that isn't 0.
    // Setting to 0 is handled by the checkbox click or explicit manual input of 0.
  }, [userWants10PercentTip, sumOfOtherCauseAreas, dispatch, causeAreaAmounts]);

  const handleTipCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUserWants10PercentTip(isChecked);
    if (!isChecked) {
      dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, 0));
    }
    // If isChecked is true, the useEffect above will handle setting the correct tip amount.
  };

  const handleOperationsAmountChange = (values: {
    floatValue: number | undefined;
    formattedValue: string;
    value: string;
  }) => {
    const numericValue = values.floatValue === undefined ? 0 : values.floatValue;
    dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, numericValue));

    // After dispatch, sumOfOtherCauseAreas would not have changed yet in this render cycle.
    // So, we compare the new numericValue with 10% of the sumOfOtherCauseAreas (which is already correct).
    const expectedTip = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);
    if (numericValue === expectedTip) {
      if (!userWants10PercentTip) setUserWants10PercentTip(true);
    } else {
      if (userWants10PercentTip) setUserWants10PercentTip(false);
    }
  };

  const handleNext = () => {
    // Ensure the final sum for the store includes the latest tip calculation
    // The `totalAmount` useMemo should correctly reflect the sum of all causeAreaAmounts.
    dispatch(setSum(totalAmount));
    dispatch(nextPane());
  };

  const suggestedSums = recurring
    ? amountContext.preset_amounts_recurring
    : amountContext.preset_amounts_single;

  // Function to render a single cause area form
  const renderCauseAreaForm = (causeArea: CauseArea, isSingleSelection: boolean) => {
    // Check if cause area has only one organization
    const hasSingleOrg = causeArea.organizations.length === 1;

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
          {hasSingleOrg ? ( // Simplified view for single org cause areas
            <TotalSumWrapper>
              {isSingleSelection && ( // Only show suggested sums for single cause area selection
                <SumButtonsWrapper>
                  {suggestedSums.map((suggested) => (
                    <div key={suggested.amount}>
                      <EffektButton
                        variant={EffektButtonVariant.SECONDARY}
                        selected={causeAreaAmounts[causeArea.id] === suggested.amount}
                        onClick={() => {
                          plausible("SelectSuggestedSum", { props: { sum: suggested.amount } });
                          const v = suggested.amount;
                          // For single cause area selection, this button sets the amount for this CA
                          dispatch(setCauseAreaAmount(causeArea.id, v));
                          dispatch(setOrgAmount(causeArea.organizations[0].id, v)); // also set org amount
                          // If it's a single selection mode, this effectively becomes the "main" sum before tip
                          // The overall sum (totalAmount) will be this + tip.
                        }}
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
                  <NumericFormat /* Using NumericFormat for consistency */
                    name={`sum-${causeArea.id}`}
                    thousandSeparator=" "
                    allowNegative={false}
                    decimalScale={0}
                    type="tel"
                    placeholder="0"
                    value={causeAreaAmounts[causeArea.id] > 0 ? causeAreaAmounts[causeArea.id] : ""}
                    autoComplete="off"
                    data-cy="donation-sum-input"
                    onValueChange={(values) => {
                      const v = values.floatValue === undefined ? 0 : values.floatValue;
                      dispatch(setCauseAreaAmount(causeArea.id, v));
                      if (hasSingleOrg) {
                        // For single org, also set the org amount directly
                        dispatch(setOrgAmount(causeArea.organizations[0].id, v));
                      }
                      // No need to dispatch setSum here for single selection; totalAmount handles it.
                    }}
                  />
                </span>
              </SumWrapper>
            </TotalSumWrapper>
          ) : (
            // Standard view for multi-org cause areas or non-single selection
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
                              selected={causeAreaAmounts[causeArea.id] === suggested.amount}
                              onClick={() => {
                                plausible("SelectSuggestedSum", {
                                  props: { sum: suggested.amount },
                                });
                                const v = suggested.amount;
                                dispatch(setCauseAreaAmount(causeArea.id, v));
                              }}
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
                            causeAreaAmounts[causeArea.id] > 0 ? causeAreaAmounts[causeArea.id] : ""
                          }
                          allowNegative={false}
                          step={1} // step and decimalScale are good for NumericFormat
                          decimalScale={0}
                          autoComplete="off"
                          data-cy="donation-sum-input"
                          onValueChange={(values) => {
                            const v = values.floatValue === undefined ? 0 : values.floatValue;
                            dispatch(setCauseAreaAmount(causeArea.id, v));
                          }}
                        />
                      </span>
                    </SumWrapper>
                  </TotalSumWrapper>
                </div>
              </AnimateHeight>
              <RadioButtonGroup
                options={[
                  {
                    title: "Låt Ge Effektivt valja organisasjoner", //smartDistContext.smart_distribution_radiobutton_text,
                    value: ShareType.STANDARD,
                  },
                  {
                    title: "Velj organisasjoner selv", // smartDistContext.custom_distribution_radiobutton_text,
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
                                    const v =
                                      values.floatValue === undefined ? 0 : values.floatValue;
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
                  // If switching to STANDARD, and there was a custom amount for the cause area,
                  // we check if there are any org amounts set. If not, we spread the custom amount
                  // according to the standard share for organizations.
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
      </FormWrapper>
    );
  };

  const renderOperationalSupportForm = () => {
    return (
      <FormWrapper>
        <div>
          <CauseAreaTitle>
            {getCauseAreaIconById(OPERATIONS_CAUSE_AREA_ID)}
            Drift
          </CauseAreaTitle>
          <CauseAreaContext>
            För värje krone till drift förväntar vi att samla in minst 10 krone till ändamål.
          </CauseAreaContext>
        </div>
        <div>
          <CheckBoxWrapper>
            <HiddenCheckBox
              type="checkbox"
              checked={userWants10PercentTip} // Bind to the new state
              onChange={handleTipCheckboxChange} // Use the new handler
              data-cy="tip-checkbox"
            />
            <CustomCheckBox
              checked={userWants10PercentTip} // Bind to the new state
              label={`Tip ${TIP_PERCENTAGE}% to operations of Ge Effektivt`}
            />
          </CheckBoxWrapper>
          <TotalSumWrapper>
            <SumWrapper>
              <span>
                <NumericFormat
                  name={`sum-${OPERATIONS_CAUSE_AREA_ID}`}
                  type="tel"
                  placeholder="0"
                  thousandSeparator=" "
                  value={
                    causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] > 0
                      ? causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID]
                      : ""
                  }
                  autoComplete="off"
                  data-cy="donation-sum-input-operations" // Make it unique if needed for testing
                  onValueChange={handleOperationsAmountChange} // Use the new handler
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

  const renderOverallSmartDistributionForm = () => {
    // This form sets amounts for *all* cause areas based on standard percentages.
    // If operations (ID 4) is one of them, its amount will be set here.
    // The tip checkbox logic should still react if the user then manually changes the operations amount.
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
                    selected={totalAmount === suggested.amount} // totalAmount here is the sum of all standard %
                    onClick={() => {
                      plausible("SelectSuggestedSum", { props: { sum: suggested.amount } });
                      const v = suggested.amount;
                      let isTipExplicitlySetByStandardShare = false;
                      let calculatedTipIfStandard = 0;
                      let sumForTipCalculation = 0;

                      // First pass: calculate sum for tip and see if tip is standard
                      causeAreas.forEach((ca) => {
                        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
                          if (ca.id !== OPERATIONS_CAUSE_AREA_ID) {
                            sumForTipCalculation += (ca.standardPercentageShare / 100) * v;
                          }
                        }
                      });

                      const operationsArea = causeAreas.find(
                        (ca) => ca.id === OPERATIONS_CAUSE_AREA_ID,
                      );
                      if (
                        operationsArea &&
                        operationsArea.standardPercentageShare &&
                        operationsArea.standardPercentageShare > 0
                      ) {
                        isTipExplicitlySetByStandardShare = true;
                        calculatedTipIfStandard =
                          (operationsArea.standardPercentageShare / 100) * v;
                      }

                      // Second pass: dispatch amounts
                      causeAreas.forEach((ca) => {
                        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
                          dispatch(
                            setCauseAreaAmount(
                              ca.id,
                              Math.round((ca.standardPercentageShare / 100) * v),
                            ),
                          ); // Round amounts
                          dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
                        }
                      });

                      // Update tip state based on whether the overall distribution matches 10%
                      const finalOperationsAmount = causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0; // Amount after dispatch
                      const expectedTipAfterDistribution = Math.round(
                        (TIP_PERCENTAGE / 100) * sumForTipCalculation,
                      );

                      if (isTipExplicitlySetByStandardShare) {
                        // If standard shares define the tip, check if that defined tip is the 10%
                        if (calculatedTipIfStandard === expectedTipAfterDistribution) {
                          setUserWants10PercentTip(true);
                        } else {
                          setUserWants10PercentTip(false);
                        }
                      } else {
                        // If tip is not part of standard shares, it implies 0 unless userWants10PercentTip is true
                        // and it will be added by the effect. But here, standard shares *don't* include it.
                        // So, if userWants10PercentTip was true, it would get overridden to 0 by above dispatches if ID 4 had no standard share.
                        // This case needs careful handling if operations has no standardPercentageShare.
                        // For now, assume if operations has no standard share, its amount becomes 0 from above,
                        // and then userWants10PercentTip should be false unless sumForTipCalculation is also 0.
                        if (0 === expectedTipAfterDistribution) {
                          // 10% of 0 is 0
                          setUserWants10PercentTip(true);
                        } else {
                          setUserWants10PercentTip(false);
                        }
                      }
                    }}
                    noMinWidth={true}
                  >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                  {suggested.subtext && <i>{suggested.subtext}</i>}
                </div>
              ))}
            </SumButtonsWrapper>
            <SumWrapper>
              <span>
                <NumericFormat /* Using NumericFormat for consistency */
                  name={`sum`}
                  thousandSeparator=" "
                  allowNegative={false}
                  decimalScale={0}
                  type="tel"
                  placeholder="0"
                  value={totalAmount > 0 ? totalAmount : ""} // This is the overall total input
                  autoComplete="off"
                  data-cy="donation-sum-input-overall"
                  onValueChange={(values) => {
                    const v = values.floatValue === undefined ? 0 : values.floatValue;
                    if (v > 0) {
                      let sumForTipCalculation = 0;
                      // Distribute v according to standard percentages
                      causeAreas.forEach((ca) => {
                        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
                          const amountForCA = Math.round((ca.standardPercentageShare / 100) * v);
                          dispatch(setCauseAreaAmount(ca.id, amountForCA));
                          dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
                          if (ca.id !== OPERATIONS_CAUSE_AREA_ID) {
                            sumForTipCalculation += amountForCA;
                          }
                        }
                      });
                      // After dispatching all standard shares, check the operations amount
                      const finalOperationsAmount = causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0; // Amount after dispatch
                      const expectedTip = Math.round((TIP_PERCENTAGE / 100) * sumForTipCalculation);
                      if (finalOperationsAmount === expectedTip) {
                        setUserWants10PercentTip(true);
                      } else {
                        setUserWants10PercentTip(false);
                      }
                    } else {
                      // Set all to 0
                      causeAreas.forEach((ca) => {
                        if (ca.standardPercentageShare && ca.standardPercentageShare > 0) {
                          dispatch(setCauseAreaAmount(ca.id, 0));
                          dispatch(setCauseAreaDistributionType(ca.id, ShareType.STANDARD));
                        }
                      });
                      setUserWants10PercentTip(true); // 10% of 0 is 0, so tip mechanism can be considered "active"
                    }
                  }}
                />
              </span>
            </SumWrapper>
          </TotalSumWrapper>
        </div>
      </FormWrapper>
    );
  };

  // For single cause area
  const selectedCA = causeAreas.find((c) => c.id === selectedCauseAreaId);

  return (
    <Pane>
      <PaneContainer>
        <div>
          <RecurringSelectionWrapper>
            <RadioButtonGroup
              options={[
                {
                  title: text.single_donation_text,
                  value: RecurringDonation.NON_RECURRING,
                  disabled: !enableSingle,
                },
                {
                  title: text.monthly_donation_text,
                  value: RecurringDonation.RECURRING,
                  disabled: !enableRecurring,
                },
              ]}
              selected={recurring}
              onSelect={(val: RecurringDonation) => dispatch(setRecurring(val))}
            />
          </RecurringSelectionWrapper>

          <CauseAreasWrapper>
            {/* For multiple cause areas */}
            {selectionType === "multiple" &&
              selectedCauseAreaId !== -1 && ( // Ensure not overall smart dist
                <>
                  {causeAreas
                    .filter((ca) => ca.id !== 5 && ca.id !== OPERATIONS_CAUSE_AREA_ID)
                    .map((ca) => {
                      // Render others first
                      return renderCauseAreaForm(ca, false);
                    })}
                  {renderOperationalSupportForm()} {/* Then render operations form */}
                  <TotalAmountWrapper>
                    <div>Total</div>
                    <div>{thousandize(totalAmount)} kr</div>
                  </TotalAmountWrapper>
                </>
              )}

            {/* For single cause area */}
            {selectionType === "single" && selectedCA && (
              <>
                {renderCauseAreaForm(selectedCA, true)}
                {renderOperationalSupportForm()}
                <TotalAmountWrapper>
                  <div>Total</div>
                  <div>{thousandize(totalAmount)} kr</div>
                </TotalAmountWrapper>
              </>
            )}

            {selectedCauseAreaId === -1 && renderOverallSmartDistributionForm()}
          </CauseAreasWrapper>
        </div>

        <ActionBar>
          <NextButton disabled={totalAmount <= 0} onClick={handleNext}>
            {nextButtonText}
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};

export type ErrorText = { error: DonationError; text: string };

const getCauseAreaContextById = (id: number) => {
  switch (id) {
    case OPERATIONS_CAUSE_AREA_ID: // Use constant
      return "För värje krone til drift forventar vi att samla inn minst 10 krone till ändamål.";
    case 5: // Assuming 5 is another special ID
      return "Överföringar till andra organisationer efter överenskommelse med Ge Effektivt.";
    default:
      return null;
  }
};

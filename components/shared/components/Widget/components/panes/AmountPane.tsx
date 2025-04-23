import React, { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "./Panes.style";
import { ActionBar, SumButtonsWrapper } from "./DonationPane/DonationPane.style";
import { SumWrapper } from "./DonationPane/DonationPane.style";
import { NextButton } from "../shared/Buttons/NavigationButtons";
import { State } from "../../store/state";
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
  CauseAreasWrapper,
  CauseAreaTitle,
  FormWrapper,
  InputList,
  OrganizationInputWrapper,
  RecurringSelectionWrapper,
  TotalSumWrapper,
} from "./AmountPane.style";
import { AmountContext } from "../../types/WidgetProps";
import { EffektButton, EffektButtonVariant } from "../../../EffektButton/EffektButton";
import { thousandize } from "../../../../../../util/formatting";
import { usePlausible } from "next-plausible";
import { CauseArea } from "../../types/CauseArea";
import { getCauseAreaIconById } from "./SelectionPane.style";
import AnimateHeight from "react-animate-height";
import Link from "next/link";
import { NumericFormat } from "react-number-format";

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

  // Helper to compute total amount
  const totalAmount = React.useMemo(() => {
    if (selectionType === "multiple") {
      return causeAreas.reduce((acc, area) => {
        if (causeAreaDistributionType[area.id] === ShareType.STANDARD) {
          return acc + (causeAreaAmounts[area.id] || 0);
        } else {
          return (
            acc +
            area.organizations.reduce((orgAcc, org) => {
              return orgAcc + (orgAmounts[org.id] || 0);
            }, 0)
          );
        }
      }, 0);
    }
    if (selectionType === "single" && selectedCauseAreaId != null) {
      if (causeAreaDistributionType[selectedCauseAreaId] === ShareType.STANDARD) {
        return causeAreaAmounts[selectedCauseAreaId] || 0;
      } else {
        return (
          causeAreas
            .find((area) => area.id === selectedCauseAreaId)
            ?.organizations.reduce((orgAcc, org) => {
              return orgAcc + (orgAmounts[org.id] || 0);
            }, 0) || 0
        );
      }
    }
    return 0;
  }, [selectionType, causeAreaAmounts, orgAmounts, selectedCauseAreaId, causeAreaDistributionType]);

  const handleNext = () => {
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
        </div>
        <div>
          {hasSingleOrg ? (
            // Simplified view for cause areas with only one organization
            <TotalSumWrapper>
              {/* Only show suggested sums for single cause area selection */}
              {isSingleSelection && (
                <SumButtonsWrapper>
                  {suggestedSums.map((suggested) => (
                    <div key={suggested.amount}>
                      <EffektButton
                        variant={EffektButtonVariant.SECONDARY}
                        selected={causeAreaAmounts[causeArea.id] === suggested.amount}
                        onClick={() => {
                          plausible("SelectSuggestedSum", {
                            props: {
                              sum: suggested.amount,
                            },
                          });
                          const v = suggested.amount;
                          if (isSingleSelection) {
                            dispatch(setSum(v));
                          }
                          dispatch(setCauseAreaAmount(causeArea.id, v));
                          // For single org, we also set the org amount directly
                          if (hasSingleOrg) {
                            dispatch(setOrgAmount(causeArea.organizations[0].id, v));
                          }
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
                  <input
                    name={`sum-${causeArea.id}`}
                    type="tel"
                    placeholder="0"
                    value={causeAreaAmounts[causeArea.id] > 0 ? causeAreaAmounts[causeArea.id] : ""}
                    autoComplete="off"
                    data-cy="donation-sum-input"
                    onChange={(e) => {
                      if (
                        Number.isInteger(parseInt(e.target.value)) === true &&
                        parseInt(e.target.value) > 0
                      ) {
                        const v = parseInt(e.target.value);
                        dispatch(setCauseAreaAmount(causeArea.id, v));
                        if (isSingleSelection) {
                          dispatch(setSum(v));
                        }
                        // For single org, we also set the org amount directly
                        if (hasSingleOrg) {
                          dispatch(setOrgAmount(causeArea.organizations[0].id, v));
                        }
                      } else {
                        dispatch(setCauseAreaAmount(causeArea.id, 0));
                        if (isSingleSelection) {
                          dispatch(setSum(-1));
                        }
                        // Clear org amount as well
                        if (hasSingleOrg) {
                          dispatch(setOrgAmount(causeArea.organizations[0].id, 0));
                        }
                      }
                    }}
                  />
                </span>
              </SumWrapper>
            </TotalSumWrapper>
          ) : (
            <>
              <AnimateHeight
                height={causeAreaDistributionType[causeArea.id] ? "auto" : 0}
                animateOpacity
                duration={300}
              >
                <div style={{ paddingBottom: "30px" }}>
                  <TotalSumWrapper>
                    {/* Only show suggested sums for single cause area selection */}
                    {isSingleSelection && (
                      <SumButtonsWrapper>
                        {suggestedSums.map((suggested) => (
                          <div key={suggested.amount}>
                            <EffektButton
                              variant={EffektButtonVariant.SECONDARY}
                              selected={causeAreaAmounts[causeArea.id] === suggested.amount}
                              onClick={() => {
                                plausible("SelectSuggestedSum", {
                                  props: {
                                    sum: suggested.amount,
                                  },
                                });
                                const v = suggested.amount;
                                if (isSingleSelection) {
                                  dispatch(setSum(v));
                                }
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
                          step={1}
                          decimalScale={0}
                          autoComplete="off"
                          data-cy="donation-sum-input"
                          onValueChange={(e) => {
                            if (typeof e.floatValue === "number") {
                              dispatch(setCauseAreaAmount(causeArea.id, e.floatValue));
                            } else {
                              dispatch(setCauseAreaAmount(causeArea.id, 0));
                            }
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
                    title: smartDistContext.smart_distribution_radiobutton_text,
                    value: ShareType.STANDARD,
                  },
                  {
                    title: smartDistContext.custom_distribution_radiobutton_text,
                    value: ShareType.CUSTOM,
                    content: (
                      <InputList>
                        {causeArea.organizations.map((org) => (
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
                                onValueChange={(e) => {
                                  if (typeof e.floatValue === "number") {
                                    dispatch(setOrgAmount(org.id, e.floatValue));
                                  } else {
                                    dispatch(setOrgAmount(org.id, 0));
                                  }
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
                onSelect={(val: ShareType) =>
                  dispatch(
                    setCauseAreaDistributionType(
                      causeArea.id,
                      val === ShareType.STANDARD ? ShareType.STANDARD : ShareType.CUSTOM,
                    ),
                  )
                }
              />
            </>
          )}
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
            {selectionType === "multiple" && (
              <>
                {causeAreas.map((ca) => {
                  return renderCauseAreaForm(ca, false);
                })}
              </>
            )}

            {/* For single cause area */}
            {selectionType === "single" && selectedCA && renderCauseAreaForm(selectedCA, true)}
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

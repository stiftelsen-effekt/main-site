import { usePlausible } from "next-plausible";
import Link from "next/link";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { DonorContext } from "../../../../../../profile/layout/donorProvider";
import { ANONYMOUS_DONOR } from "../../../config/anonymous-donor";
import {
  selectPaymentMethod,
  submitDonorInfo,
  registerDonationAction,
  RegisterDonationActionPayload,
} from "../../../store/donation/actions";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import { WidgetPane2Props, WidgetProps } from "../../../types/WidgetProps";
import { ErrorField } from "../../shared/Error/ErrorField";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import { CheckBoxWrapper, HiddenCheckBox, InputFieldWrapper } from "../Forms.style";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { CustomCheckBox } from "./CustomCheckBox";
import { ActionBar, CheckBoxGroupWrapper, DonorForm, InfoMessageWrapper } from "./DonorPane.style";
import { getEstimatedLtv } from "../../../../../../../util/ltv";
import AnimateHeight from "react-animate-height";
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../store/donation/types";
import { Action } from "typescript-fsa";
import { LayoutActionTypes } from "../../../store/layout/types";
import { calculateDonationBreakdown } from "../../../utils/donationCalculations";
import { DonationSummary, DonationSummaryText } from "../../shared/DonationSummary/DonationSummary";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { StyledSpinner } from "../../shared/Buttons/NavigationButtons.style";
import {
  PaymentButton,
  PaymentButtonsWrapper,
} from "../../shared/DonationSummary/DonationSummary.style";
import { paymentMethodConfigurations } from "../../../config/methods";
import { useSsnValidation } from "./useSsnValidation";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC<{
  locale: "en" | "no" | "sv" | "et" | "dk";
  text: WidgetPane2Props;
  summaryText: DonationSummaryText;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
  isSingleCauseArea?: boolean;
}> = ({ locale, text, summaryText, paymentMethods, isSingleCauseArea = false }) => {
  const dispatch =
    useDispatch<
      Dispatch<DonationActionTypes | Action<RegisterDonationActionPayload> | LayoutActionTypes>
    >();
  const donor = useSelector((state: State) => state.donation.donor);
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];
  const { donor: initialDonor } = useContext(DonorContext);

  const breakdown = calculateDonationBreakdown(
    donation.causeAreaAmounts ?? {},
    donation.orgAmounts ?? {},
    donation.causeAreaDistributionType ?? {},
    donation.operationsPercentageModeByCauseArea ?? {},
    donation.operationsPercentageByCauseArea ?? {},
    causeAreas,
    donation.selectionType ?? "single",
    donation.selectedCauseAreaId ?? 1,
    donation.globalOperationsEnabled ?? false,
    donation.globalOperationsPercentage ?? donation.operationsConfig?.defaultPercentage ?? 10,
    donation.operationsConfig?.excludedCauseAreaIds ?? [],
    donation.operationsConfig?.operationsCauseAreaId ?? 4,
    donation.smartDistributionTotal,
  );
  const totalSumIncludingTip = breakdown.totalAmount;

  const {
    register,
    watch,
    trigger,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      isAnonymous: donor?.email === ANONYMOUS_DONOR.email,
      name: donor.name === ANONYMOUS_DONOR.name ? "" : initialDonor?.name || donor.name || "",
      email: donor.email === ANONYMOUS_DONOR.email ? "" : initialDonor?.email || donor.email || "",
      ssn: donor.ssn === ANONYMOUS_DONOR.ssn ? "" : donor.ssn || "",
      taxDeduction: donor.taxDeduction,
      newsletter: donor.newsletter,
      method: donation.method,
      privacyPolicy: false,
    },
  });

  const plausible = usePlausible();

  const taxDeductionChecked = watch("taxDeduction");
  const newsletterChecked = watch("newsletter");
  const isAnonymous = watch("isAnonymous");
  const [loadingMethod, setLoadingMethod] = React.useState<string | null>(null);
  // For the single-cause-area flow, payment method selection is a distinct
  // step from submission (matches the pre-rewrite behavior) - the radio
  // just records a choice, and a separate Next button submits it.
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<string | null>(null);

  // If registration fails, clear the loading state so the button shows its
  // label again instead of being stuck showing a spinner indefinitely.
  // apiError can be null (rather than just absent/undefined) to signal a
  // generic error message, so check for that explicitly rather than
  // truthiness - a falsy-but-set apiError must still trigger the reset.
  React.useEffect(() => {
    if (typeof donation.apiError !== "undefined") {
      setLoadingMethod(null);
    }
  }, [donation.apiError]);

  // Locale-aware SSN/CPR validation (handles NO, SE and DK CPR/CVR incl. suspicious CPR warning)
  const { validateSsn, handleSsnChange, cprSuspicious } = useSsnValidation({
    locale,
    taxDeductionChecked,
  });

  const mapPaymentMethod = (method: string): PaymentMethod => {
    const mapped = paymentMethodMap[method];
    if (!mapped) throw new Error(`Unknown payment method: ${method}`);
    return mapped;
  };

  const handlePayment = async (methodId: string) => {
    // trigger() runs and populates validation for every registered field -
    // handlePayment fires directly from a button click rather than a form
    // submit, so react-hook-form never validates on its own otherwise
    const isValid = await trigger();
    if (!isValid) return;

    setLoadingMethod(methodId);
    const paymentMethod = mapPaymentMethod(methodId);

    // Get current form data
    const formData = watch();

    // Submit donor info and payment method
    if (!formData.isAnonymous) {
      plausible("SubmitDonorPane", {
        props: {
          donorType: formData.isAnonymous ? 0 : 1,
          taxDeduction: formData.taxDeduction,
          newsletter: formData.newsletter,
          method: paymentMethod,
        },
      });

      if (donation.recurring) {
        if (paymentMethod === PaymentMethod.VIPPS) plausible("SelectVippsRecurring");
        if (paymentMethod === PaymentMethod.AVTALEGIRO) plausible("SelectAvtaleGiro");
        if (paymentMethod === PaymentMethod.AUTOGIRO) plausible("SelectAutoGiro");

        if (totalSumIncludingTip) {
          if (
            // @ts-ignore
            typeof window !== "undefined" &&
            // @ts-ignore
            typeof window.fbq !== "undefined" &&
            // @ts-ignore
            window.fbq != null
          ) {
            getEstimatedLtv({ method: paymentMethod, sum: totalSumIncludingTip }).then((ltv) => {
              // @ts-ignore
              window.fbq("track", "Lead", {
                value: ltv,
                currency: "NOK",
              });
            });
          }
        }
      }
      if (!donation.recurring) {
        if (paymentMethod === PaymentMethod.VIPPS) plausible("SelectSingleVippsPayment");
        if (paymentMethod === PaymentMethod.SWISH) {
          plausible("SelectSwishSingle");
        }
        if (paymentMethod === PaymentMethod.BANK) {
          plausible("SelectBankSingle");
        }
        // Facebook pixel tracking for Leads
        if (typeof window !== "undefined") {
          // @ts-ignore
          if (window.fbq != null) {
            // @ts-ignore
            window.fbq("track", "Lead", {
              value: totalSumIncludingTip,
              currency: "NOK",
            });
          }
        }
      }
    }

    dispatch(
      submitDonorInfo(
        formData.isAnonymous
          ? ANONYMOUS_DONOR
          : {
              name: text.show_name_field ? capitalizeNames(formData.name.trim()) : "",
              email: formData.email.trim().toLowerCase(),
              taxDeduction: formData.taxDeduction,
              ssn: formData.taxDeduction ? formData.ssn.toString().trim() : "",
              newsletter: formData.newsletter,
            },
      ),
    );

    dispatch(selectPaymentMethod(paymentMethod));

    // For external payment providers (e.g. Quickpay/MobilePay/DK bank), the saga will open the
    // provider URL directly on a successful registration.
    const configuration = paymentMethodConfigurations.find((config) => config.id === methodId);
    dispatch(
      registerDonationAction.started({
        openExternalPaymentOnRegisterSuccess: configuration?.openExternalPaymentOnRegisterSuccess,
      }),
    );
  };

  return (
    <Pane>
      <DonorForm autoComplete="on">
        <PaneContainer>
          <div>
            {isSingleCauseArea ? (
              <PaneTitle>
                <wbr />
              </PaneTitle>
            ) : (
              <DonationSummary text={summaryText} />
            )}

            {text.allow_anonymous_donations && (
              <div style={{ marginBottom: "20px" }}>
                <CheckBoxWrapper data-cy="anon-button-div">
                  <HiddenCheckBox
                    data-cy="anon-checkbox"
                    type="checkbox"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                    {...register("isAnonymous", {
                      onChange: () => {
                        clearErrors(["name", "email", "ssn"]);
                        (document.activeElement as HTMLElement).blur();
                      },
                    })}
                  />
                  <CustomCheckBox label={text.anon_button_text} checked={isAnonymous} />
                  <ToolTip text={text.anon_button_text_tooltip} />
                </CheckBoxWrapper>
              </div>
            )}

            <AnimateHeight height={isAnonymous ? 0 : "auto"} animateOpacity>
              {text.show_name_field && (
                <InputFieldWrapper>
                  <input
                    data-cy="name-input"
                    type="text"
                    placeholder={text.name_placeholder}
                    {...register("name", {
                      validate: (val, formValues) => {
                        if (formValues.isAnonymous) return true;
                        return val.trim().length > 3;
                      },
                    })}
                  />
                  {errors.name && <ErrorField text={text.name_invalid_error_text} />}
                </InputFieldWrapper>
              )}
              <InputFieldWrapper>
                <input
                  data-cy="email-input"
                  type="email"
                  placeholder={text.email_placeholder}
                  {...register("email", {
                    validate: (val, formValues) => {
                      if (formValues.isAnonymous) return true;
                      const trimmed = val.trim();
                      return /@/.test(trimmed);
                    },
                  })}
                />
                {errors.email && <ErrorField text={text.email_invalid_error_text} />}
              </InputFieldWrapper>
              <CheckBoxGroupWrapper>
                <div>
                  <CheckBoxWrapper>
                    <HiddenCheckBox
                      data-cy="tax-deduction-checkbox"
                      type="checkbox"
                      onKeyDown={(e) => {
                        if (!taxDeductionChecked) clearErrors(["ssn"]);
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      {...register("taxDeduction", {
                        onChange() {
                          if (!taxDeductionChecked) clearErrors(["ssn"]);
                          (document.activeElement as HTMLElement).blur();
                        },
                      })}
                    />
                    <CustomCheckBox
                      label={text.tax_deduction_selector_text}
                      checked={taxDeductionChecked}
                    />
                    {taxDeductionChecked && <ToolTip text={text.tax_deduction_tooltip_text} />}
                  </CheckBoxWrapper>

                  <AnimateHeight
                    height={taxDeductionChecked ? "auto" : 0}
                    animateOpacity
                    duration={200}
                  >
                    <InputFieldWrapper>
                      <input
                        data-cy="ssn-input"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder={text.tax_deduction_ssn_placeholder}
                        {...register("ssn", {
                          required: false,
                          onChange: handleSsnChange,
                          validate: (val, formValues) =>
                            validateSsn(val.toString(), formValues.isAnonymous),
                        })}
                      />
                      {errors.ssn && (
                        <ErrorField text={text.tax_deduction_ssn_invalid_error_text} />
                      )}
                      {cprSuspicious && (
                        <InfoMessageWrapper data-cy="cpr-suspicious-message">
                          Kontroller venligst at det er korrekt.
                        </InfoMessageWrapper>
                      )}
                    </InputFieldWrapper>
                  </AnimateHeight>
                </div>
                <CheckBoxWrapper>
                  <HiddenCheckBox
                    data-cy="newsletter-checkbox"
                    type="checkbox"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                    {...register("newsletter", {
                      onChange() {
                        (document.activeElement as HTMLElement).blur();
                      },
                    })}
                  />
                  <CustomCheckBox
                    label={text.newsletter_selector_text}
                    mobileLabel={text.newsletter_selector_text}
                    checked={newsletterChecked}
                  />
                </CheckBoxWrapper>
                {text.privacy_policy_link && (
                  <div style={{ marginTop: "10px" }}>
                    {text.require_privacy_policy_checkbox && (
                      <>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <CheckBoxWrapper>
                            <HiddenCheckBox
                              data-cy="privacy-policy-checkbox"
                              type="checkbox"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                }
                              }}
                              {...register("privacyPolicy", {
                                required: true,
                                onChange() {
                                  (document.activeElement as HTMLElement).blur();
                                },
                              })}
                            />
                            <CustomCheckBox
                              label={text.privacy_policy_text}
                              checked={watch("privacyPolicy")}
                            />
                          </CheckBoxWrapper>
                          <Link
                            href={`/${text.privacy_policy_link.slug}`}
                            target={"_blank"}
                            onClick={(e) => {
                              e.currentTarget.blur();
                            }}
                            style={{
                              borderBottom: "1px solid var(--primary)",
                              display: "inline-flex",
                              height: "30px",
                              marginTop: "5px",
                              marginLeft: "7px",
                            }}
                          >
                            {`${text.privacy_policy_link.title}  ↗`}
                          </Link>
                        </div>
                        {errors.privacyPolicy && (
                          <ErrorField text={text.privacy_policy_required_error_text} />
                        )}
                      </>
                    )}
                    {!text.require_privacy_policy_checkbox && (
                      <>
                        {text.privacy_policy_text}{" "}
                        <Link
                          href={`/${text.privacy_policy_link.slug}`}
                          target={"_blank"}
                          onClick={(e) => {
                            e.currentTarget.blur();
                          }}
                          style={{ borderBottom: "1px solid var(--primary)" }}
                        >
                          {`${text.privacy_policy_link.title}  ↗`}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </CheckBoxGroupWrapper>
            </AnimateHeight>

            {isSingleCauseArea ? (
              <>
                <RadioButtonGroup
                  options={paymentMethods.map((method) => ({
                    title: method.selector_text,
                    value: paymentMethodMap[method._id],
                    disabled: Object.keys(errors).length > 0,
                    data_cy: `payment-method-${method._id}`,
                  }))}
                  selected={
                    selectedPaymentMethodId ? paymentMethodMap[selectedPaymentMethodId] : undefined
                  }
                  onSelect={(value) => {
                    const method = paymentMethods.find((m) => paymentMethodMap[m._id] === value);
                    if (method) setSelectedPaymentMethodId(method._id);
                  }}
                />
                <ActionBar data-cy="next-button-div">
                  <NextButton
                    type="button"
                    disabled={!selectedPaymentMethodId || Object.keys(errors).length > 0}
                    onClick={(e) => {
                      e.preventDefault();
                      if (selectedPaymentMethodId) handlePayment(selectedPaymentMethodId);
                    }}
                    data-cy="next-button"
                  >
                    {loadingMethod ? <StyledSpinner /> : text.pane2_button_text}
                  </NextButton>
                </ActionBar>
              </>
            ) : (
              <PaymentButtonsWrapper style={{ marginTop: "20px" }}>
                {paymentMethods.map((method) => (
                  <PaymentButton
                    key={method._id}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePayment(method._id);
                    }}
                    disabled={Object.keys(errors).length > 0}
                    data-cy={`payment-method-${method._id}`}
                  >
                    {loadingMethod === method._id ? <StyledSpinner /> : method.selector_text}
                  </PaymentButton>
                ))}
              </PaymentButtonsWrapper>
            )}
          </div>
        </PaneContainer>
      </DonorForm>
    </Pane>
  );
};

export const paymentMethodMap: Record<string, PaymentMethod> = {
  vipps: PaymentMethod.VIPPS,
  bank: PaymentMethod.BANK,
  swish: PaymentMethod.SWISH,
  autogiro: PaymentMethod.AUTOGIRO,
  avtalegiro: PaymentMethod.AVTALEGIRO,
  quickpay_card: PaymentMethod.QUICKPAY_CARD,
  quickpay_mobilepay: PaymentMethod.QUICKPACK_MOBILEPAY,
  dkbank: PaymentMethod.DKBANK,
};

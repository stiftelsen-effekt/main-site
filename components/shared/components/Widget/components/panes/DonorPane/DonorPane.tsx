import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import Organisationsnummer from "organisationsnummer";
import Personnummer from "personnummer";
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
} from "../../../store/donation/actions";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import { WidgetPane2Props, WidgetProps } from "../../../types/WidgetProps";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { ErrorField } from "../../shared/Error/ErrorField";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import { CheckBoxWrapper, HiddenCheckBox, InputFieldWrapper } from "../Forms.style";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { CustomCheckBox } from "./CustomCheckBox";
import { ActionBar, CheckBoxGroupWrapper, DonorForm } from "./DonorPane.style";
import { getEstimatedLtv } from "../../../../../../../util/ltv";
import AnimateHeight from "react-animate-height";
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../store/donation/types";
import { Action } from "typescript-fsa";
import { nextPane } from "../../../store/layout/actions";
import { LayoutActionTypes } from "../../../store/layout/types";
import { calculateDonationSum } from "../../../store/donation/saga";
import { DonationSummary } from "../../shared/DonationSummary/DonationSummary";
import { PaymentButton, PaymentButtonsWrapper } from "../SummaryPane/SummaryPane.style";
import { StyledSpinner } from "../../shared/Buttons/NavigationButtons.style";

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC<{
  locale: "en" | "no" | "sv" | "et";
  text: WidgetPane2Props;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
}> = ({ locale, text, paymentMethods }) => {
  const dispatch =
    useDispatch<Dispatch<DonationActionTypes | Action<undefined> | LayoutActionTypes>>();
  const donor = useSelector((state: State) => state.donation.donor);
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];
  const { donor: initialDonor } = useContext(DonorContext);

  const { totalSumIncludingTip } = calculateDonationSum(
    donation.causeAreaAmounts ?? {},
    donation.orgAmounts ?? {},
    causeAreas,
    donation.causeAreaDistributionType ?? {},
    donation.selectionType ?? "single",
    donation.selectedCauseAreaId ?? 1,
  );

  const {
    register,
    watch,
    control,
    formState: { errors, isValid },
    handleSubmit,
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
    },
  });

  const plausible = usePlausible();

  const taxDeductionChecked = watch("taxDeduction");
  const newsletterChecked = watch("newsletter");
  const isAnonymous = watch("isAnonymous");
  const [loadingMethod, setLoadingMethod] = React.useState<string | null>(null);

  const mapPaymentMethod = (method: string): PaymentMethod => {
    switch (method) {
      case "bank":
        return PaymentMethod.BANK;
      case "vipps":
        return PaymentMethod.VIPPS;
      case "avtalegiro":
        return PaymentMethod.AVTALEGIRO;
      case "swish":
        return PaymentMethod.SWISH;
      case "autogiro":
        return PaymentMethod.AUTOGIRO;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }
  };

  const handlePayment = (methodId: string) => {
    if (Object.keys(errors).length > 0) return;

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
          // @ts-ignore
          if (
            typeof window !== "undefined" &&
            typeof window.fbq !== "undefined" &&
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
              name: capitalizeNames(formData.name.trim()),
              email: formData.email.trim().toLowerCase(),
              taxDeduction: formData.taxDeduction,
              ssn: formData.taxDeduction ? formData.ssn.toString().trim() : "",
              newsletter: formData.newsletter,
            },
      ),
    );

    dispatch(selectPaymentMethod(paymentMethod));
    dispatch(registerDonationAction.started(undefined));
  };

  return (
    <Pane>
      <DonorForm autoComplete="on">
        <PaneContainer>
          <div>
            <PaneTitle>
              <wbr />
            </PaneTitle>

            <DonationSummary compact={true} title="Din donation" />

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

            <AnimateHeight height={isAnonymous ? 0 : "auto"} animateOpacity>
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
                          validate: (val, formValues) => {
                            if (formValues.isAnonymous || !taxDeductionChecked) return true;
                            const trimmed = val.toString().trim();
                            if (taxDeductionChecked) {
                              if (locale === "no") {
                                return validateSsnNo(trimmed);
                              } else if (locale === "sv") {
                                return validateSsnSe(trimmed);
                              } else {
                                return true;
                              }
                            } else {
                              return true;
                            }
                          },
                        })}
                      />
                      {errors.ssn && (
                        <ErrorField text={text.tax_deduction_ssn_invalid_error_text} />
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
                  </div>
                )}
              </CheckBoxGroupWrapper>
            </AnimateHeight>

            <PaymentButtonsWrapper style={{ marginTop: "20px" }}>
              {paymentMethods.map((method) => (
                <PaymentButton
                  key={method._id}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePayment(method._id);
                  }}
                  disabled={Object.keys(errors).length > 0}
                  data-cy={`payment-method-${(method as any)._type || "unknown"}`}
                >
                  {loadingMethod === method._id ? <StyledSpinner /> : method.selector_text}
                </PaymentButton>
              ))}
            </PaymentButtonsWrapper>
          </div>
        </PaneContainer>
      </DonorForm>
    </Pane>
  );
};

const validateSsnNo = (ssn: string): boolean => {
  return (ssn.length === 9 && validateOrg(ssn)) || (ssn.length === 11 && validateSsn(ssn));
};

const validateSsnSe = (ssn: string): boolean => {
  return Personnummer.valid(ssn) || Organisationsnummer.valid(ssn);
};

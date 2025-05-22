import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import Organisationsnummer from "organisationsnummer";
import Personnummer from "personnummer";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { DonorContext } from "../../../../../../profile/layout/donorProvider";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { ANONYMOUS_DONOR } from "../../../config/anonymous-donor";
import {
  registerDonationAction,
  selectPaymentMethod,
  submitDonorInfo,
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
import { API_URL } from "../../../config/api";
import { getEstimatedLtv } from "../../../../../../../util/ltv";
import { ExtraMessageWrapper } from "../DonationPane/DonationPane.style";
import { Info } from "react-feather";
import AnimateHeight from "react-animate-height";
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../store/donation/types";
import { Action } from "typescript-fsa";

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC<{
  locale: "en" | "no" | "sv" | "et";
  text: WidgetPane2Props;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
}> = ({
  locale,
  text,
  paymentMethods,
  text: {
    enable_anonymous_donation = true,
    enable_name_field = true,
    privacy_policy_display = "none",
  } = {},
}) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes | Action<undefined>>>();
  const donor = useSelector((state: State) => state.donation.donor);
  const donation = useSelector((state: State) => state.donation);
  const { donor: initialDonor } = useContext(DonorContext);

  const {
    register,
    watch,
    control,
    setValue,
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
      privacyPolicyAccepted: false, // Step 2
    },
    mode: "onChange", // To make isValid update more frequently
  });

  const plausible = usePlausible();

  const taxDeductionChecked = watch("taxDeduction");
  const newsletterChecked = watch("newsletter");
  const isAnonymous = watch("isAnonymous");
  const selectedPaymentMethod = watch("method");
  const privacyPolicyAcceptedValue = watch("privacyPolicyAccepted"); // Step 6

  // Step 1: Remove useState for privacyPolicyAccepted and formSubmittedOnce

  useEffect(() => {
    if (!enable_anonymous_donation && isAnonymous) {
      setValue("isAnonymous", false);
      if (!enable_name_field) {
        clearErrors("name");
      }
    }
  }, [enable_anonymous_donation, isAnonymous, setValue, enable_name_field, clearErrors]);

  const paneSubmitted = handleSubmit((data) => {
    // Step 1: formSubmittedOnce removed, rely on RHF validation state (errors object)
    // The check for privacyPolicyAccepted is now handled by RHF validation rules.

    if (!isAnonymous) {
      plausible("SubmitDonorPane", {
        props: {
          donorType: isAnonymous ? 0 : 1,
          taxDeduction: data.taxDeduction,
          newsletter: data.newsletter,
          method: data.method,
        },
      });

      if (donation.recurring) {
        if (data.method) {
          if (data.method === PaymentMethod.VIPPS) plausible("SelectVippsRecurring");
          if (data.method === PaymentMethod.AVTALEGIRO) plausible("SelectAvtaleGiro");
          if (data.method === PaymentMethod.AUTOGIRO) plausible("SelectAutoGiro");

          if (donation.sum) {
            getEstimatedLtv({ method: data.method, sum: donation.sum }).then((ltv) => {
              if (typeof window !== "undefined") {
                // @ts-ignore
                if (typeof window.fbq != null) {
                  // @ts-ignore
                  window.fbq("track", "Lead", {
                    value: ltv,
                    currency: "NOK",
                  });
                }
              }
            });
          }
        }
      }
      if (!donation.recurring) {
        if (data.method === PaymentMethod.VIPPS) plausible("SelectSingleVippsPayment");
        if (data.method === PaymentMethod.SWISH) {
          plausible("SelectSwishSingle");
        }
        if (data.method === PaymentMethod.BANK) {
          plausible("SelectBankSingle");
        }
        // Facebook pixel tracking for Leads
        if (typeof window !== "undefined") {
          // @ts-ignore
          if (window.fbq != null) {
            // @ts-ignore
            window.fbq("track", "Lead", {
              value: donation.sum,
              currency: "NOK",
            });
          }
        }
      }
    }
    dispatch(
      submitDonorInfo(
        isAnonymous
          ? ANONYMOUS_DONOR
          : {
              name: capitalizeNames(data.name.trim()),
              email: data.email.trim().toLowerCase(),
              taxDeduction: data.taxDeduction,
              ssn: data.taxDeduction ? data.ssn.toString().trim() : "",
              newsletter: data.newsletter,
            },
      ),
    );

    dispatch(selectPaymentMethod(data.method || PaymentMethod.BANK));

    if (isAnonymous || donation.errors.length === 0) {
      dispatch(registerDonationAction.started(undefined));
    } else {
      alert("Donation invalid");
    }
  });

  return (
    <Pane>
      <DonorForm onSubmit={paneSubmitted} autoComplete="on">
        <PaneContainer>
          <div>
            <PaneTitle>
              <wbr />
            </PaneTitle>

            {enable_anonymous_donation && (
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
              {enable_name_field && !isAnonymous && (
                <InputFieldWrapper>
                  <input
                    data-cy="name-input"
                    type="text"
                    placeholder={text.name_placeholder}
                    {...register("name", {
                      validate: (val, formValues) => {
                        // This validation runs only if the field is rendered.
                        // If enable_name_field is false AND enable_anonymous_donation is false,
                        // isAnonymous will be false, the field won't render,
                        // but this validation won't prevent form submission if name is required by logic elsewhere.
                        // However, react-hook-form will require 'name' if it's a required field in the form state
                        // which is handled by the defaultValues and the register function.
                        if (formValues.isAnonymous) return true; // Should not happen if !enable_anonymous_donation
                        return val.trim().length > 3;
                      },
                    })}
                  />
                  {errors.name && <ErrorField text={text.name_invalid_error_text} />}
                </InputFieldWrapper>
              )}
              {/* Email field is always rendered when not anonymous, as per current structure */}
              <InputFieldWrapper>
                <input
                  data-cy="email-input"
                  type="email"
                  placeholder={text.email_placeholder}
                  {...register("email", {
                    validate: (val, formValues) => {
                      if (formValues.isAnonymous) return true; // Should not happen if !enable_anonymous_donation
                      const trimmed = val.trim();
                      return /@/.test(trimmed); // Basic email validation
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
                {/* Step 4: Conditional Rendering for Privacy Policy */}
                {privacy_policy_display !== "none" && text.privacy_policy_link && (
                  // The outer div that previously held text.privacy_policy_text and Link is removed
                  // as its contents are moved into the <label> for "require_acceptance" case.
                  // For "display_only", the original structure is kept.
                  <>
                    {privacy_policy_display === "display_only" && (
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
                    {privacy_policy_display === "require_acceptance" && (
                      <div style={{ marginTop: "10px" }}> {/* This div is for spacing */}
                        <CheckBoxWrapper data-cy="privacy-checkbox-wrapper">
                          {/* HiddenCheckBox remains for RHF registration and state control */}
                          <HiddenCheckBox
                            type="checkbox"
                            id="privacyPolicyCheckbox" // ID might still be useful for aria or testing
                            {...register("privacyPolicyAccepted", {
                              required: "You must accept the privacy policy",
                            })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setValue(
                                  "privacyPolicyAccepted",
                                  !privacyPolicyAcceptedValue,
                                  { shouldValidate: true },
                                );
                                // Optionally blur if CustomCheckBox doesn't handle focus indication well
                                // (document.activeElement as HTMLElement)?.blur(); 
                              }
                            }}
                          />
                          {/* CustomCheckBox now takes the rich label directly */}
                          <CustomCheckBox
                            checked={privacyPolicyAcceptedValue}
                            label={
                              <>
                                {text.privacy_policy_text}{" "}
                                <Link
                                  href={`/${text.privacy_policy_link.slug}`}
                                  target={"_blank"}
                                  onClick={(e) => {
                                    // Prevent click on link from toggling checkbox if CustomCheckBox handles its own click
                                    e.stopPropagation();
                                    // No need to blur here as the link itself will handle focus
                                  }}
                                  style={{ borderBottom: "1px solid var(--primary)" }}
                                >
                                  {`${text.privacy_policy_link.title}  ↗`}
                                </Link>
                              </>
                            }
                            // Add onClick to toggle the RHF value
                            // This assumes CustomCheckBox itself doesn't have an input that register could directly use.
                            // We are essentially making CustomCheckBox a custom control for the HiddenCheckBox.
                            onClick={() => {
                              setValue(
                                "privacyPolicyAccepted",
                                !privacyPolicyAcceptedValue,
                                { shouldValidate: true },
                              );
                            }}
                            // Consider keyboard accessibility:
                            // If CustomCheckBox can be focused, it should also handle Space/Enter keys
                            // to toggle the value, similar to the HiddenCheckBox's onKeyDown.
                            // For now, this example focuses on the click behavior.
                          />
                        </CheckBoxWrapper>
                        {errors.privacyPolicyAccepted && (
                          <ErrorField text={errors.privacyPolicyAccepted.message} />
                        )}
                      </div>
                    )}
                  </>
                )}
              </CheckBoxGroupWrapper>
            </AnimateHeight>

            <Controller
              control={control}
              name="method"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <RadioButtonGroup
                  options={paymentMethods.map((method) => ({
                    title: method.selector_text,
                    value: {
                      vipps: PaymentMethod.VIPPS,
                      bank: PaymentMethod.BANK,
                      swish: PaymentMethod.SWISH,
                      autogiro: PaymentMethod.AUTOGIRO,
                      avtalegiro: PaymentMethod.AVTALEGIRO,
                    }[method._id],
                    data_cy: `${method._id}-method`,
                  }))}
                  selected={field.value}
                  onSelect={(option) => {
                    field.onChange(option);
                  }}
                />
              )}
            />
          </div>
          <ActionBar data-cy="next-button-div">
            <NextButton
              // Step 5: Update disabled logic
              disabled={!selectedPaymentMethod || !isValid}
              type="submit"
              // onClick for formSubmittedOnce removed
            >
              {text.pane2_button_text}
            </NextButton>
          </ActionBar>
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

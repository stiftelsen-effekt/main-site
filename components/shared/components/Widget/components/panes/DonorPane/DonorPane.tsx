import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import Organisationsnummer from "organisationsnummer";
import Personnummer from "personnummer";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
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

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC<{
  locale: "en" | "no" | "sv" | "et";
  text: WidgetPane2Props;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
}> = ({ locale, text, paymentMethods }) => {
  const dispatch = useDispatch();
  const donor = useSelector((state: State) => state.donation.donor);
  const donation = useSelector((state: State) => state.donation);
  const { donor: initialDonor } = useContext(DonorContext);

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
  const selectedPaymentMethod = watch("method");

  const paneSubmitted = handleSubmit((data) => {
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

            {!isAnonymous ? (
              <>
                <InputFieldWrapper>
                  <input
                    data-cy="name-input"
                    type="text"
                    placeholder={text.name_placeholder}
                    {...register("name", { required: true, minLength: 3 })}
                  />
                  {errors.name && <ErrorField text={text.name_invalid_error_text} />}
                </InputFieldWrapper>
                <InputFieldWrapper>
                  <input
                    data-cy="email-input"
                    type="email"
                    placeholder={text.email_placeholder}
                    {...register("email", {
                      required: true,
                      validate: (val) => {
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

                    {taxDeductionChecked && (
                      <InputFieldWrapper>
                        <input
                          data-cy="ssn-input"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder={text.tax_deduction_ssn_placeholder}
                          {...register("ssn", {
                            required: false,
                            validate: (val) => {
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
                    )}
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
                        passHref
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
              </>
            ) : null}

            {locale === "no" &&
              selectedPaymentMethod === PaymentMethod.BANK &&
              taxDeductionChecked && (
                <ExtraMessageWrapper>
                  <Info></Info>
                  For å få skattefradrag for donasjoner i 2024 må du nå bruke vipps, fordi
                  bankoverføringer bokføres for 1. januar 2024.
                </ExtraMessageWrapper>
              )}

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
              disabled={!selectedPaymentMethod || Object.keys(errors).length > 0}
              type="submit"
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

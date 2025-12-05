import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import Organisationsnummer from "organisationsnummer";
import Personnummer from "personnummer";
import {
  validateCpr,
  formatCprInput,
  validateTin,
  formatTinInput,
} from "../../../../../../../util/tin-validation";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { DonorContext } from "../../../../../../profile/layout/donorProvider";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { ANONYMOUS_DONOR } from "../../../config/anonymous-donor";
import {
  registerDonationAction,
  RegisterDonationActionPayload,
  selectPaymentMethod,
  submitDonorInfo,
} from "../../../store/donation/actions";
import { State } from "../../../store/state";
import { PaymentMethod, RecurringDonation } from "../../../types/Enums";
import {
  PaymentMethodId,
  PaymentMethodNudge,
  WidgetPane2Props,
  WidgetProps,
} from "../../../types/WidgetProps";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { ErrorField } from "../../shared/Error/ErrorField";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import { CheckBoxWrapper, HiddenCheckBox, InputFieldWrapper } from "../Forms.style";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { CustomCheckBox } from "./CustomCheckBox";
import {
  ActionBar,
  CheckBoxGroupWrapper,
  DonorForm,
  InfoMessageWrapper,
  PaymentNudge,
  PaymentNudgeContainer,
  PaymentNudgeWrapper,
} from "./DonorPane.style";
import { getEstimatedLtv } from "../../../../../../../util/ltv";
import AnimateHeight from "react-animate-height";
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../store/donation/types";
import { Action } from "typescript-fsa";
import { paymentMethodConfigurations } from "../../../config/methods";
import { thousandize, getFormattingLocale } from "../../../../../../../util/formatting";
import { Info } from "react-feather";

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC<{
  locale: "en" | "no" | "sv" | "et" | "dk";
  text: WidgetPane2Props;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
  nudges?: PaymentMethodNudge[];
}> = ({ locale, text, paymentMethods, nudges }) => {
  const dispatch =
    useDispatch<Dispatch<DonationActionTypes | Action<RegisterDonationActionPayload>>>();
  const donor = useSelector((state: State) => state.donation.donor);
  const donation = useSelector((state: State) => state.donation);
  const { donor: initialDonor } = useContext(DonorContext);

  console.log(nudges);

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
      privacyPolicy: false,
    },
  });

  const plausible = usePlausible();
  const formattingLocale = useMemo(() => getFormattingLocale(locale), [locale]);
  const paymentOptionsRef = React.useRef<HTMLDivElement>(null);

  const taxDeductionChecked = watch("taxDeduction");
  const newsletterChecked = watch("newsletter");
  const isAnonymous = watch("isAnonymous");
  const selectedPaymentMethod = watch("method");

  const [cprSuspicious, setCprSuspicious] = useState(false);
  const [nudgeArrowLeft, setNudgeArrowLeft] = useState<number | null>(null);

  const selectedPaymentMethodId = useMemo(
    () => (selectedPaymentMethod ? paymentMethodIdMap[selectedPaymentMethod] : undefined),
    [selectedPaymentMethod],
  );

  const activeNudge = useMemo(() => {
    if (!nudges || nudges.length === 0) return null;
    if (!selectedPaymentMethodId) return null;
    if (!donation.sum || donation.sum <= 0) return null;

    const recurringType =
      donation.recurring === RecurringDonation.RECURRING ? "recurring" : "single";

    return (
      nudges.find((nudge) => {
        const fromId = nudge.from_method?._id;
        const toId = nudge.to_method?._id;
        if (!fromId || !toId) return false;
        if (fromId !== selectedPaymentMethodId) return false;
        if (nudge.minimum_amount && donation.sum && donation.sum < nudge.minimum_amount)
          return false;
        if (
          nudge.recurring_type &&
          nudge.recurring_type !== "both" &&
          nudge.recurring_type !== recurringType
        ) {
          return false;
        }
        const targetAvailable = paymentMethods.some((method) => method._id === toId);
        return targetAvailable;
      }) || null
    );
  }, [nudges, selectedPaymentMethodId, donation.sum, donation.recurring, paymentMethods]);

  const nudgeMessageText = useMemo(() => {
    if (!activeNudge || !activeNudge.message) return null;

    const amount = donation.sum;
    const fromId = activeNudge.from_method?._id;
    const toId = activeNudge.to_method?._id;
    if (!amount || amount <= 0 || !fromId || !toId) {
      return activeNudge.message.replace(/\{savings\}/g, "–");
    }

    const calculateCost = (methodId: PaymentMethodId) => {
      const method = paymentMethods.find((m) => m._id === methodId);
      const transactionCost = method?.transaction_cost;
      if (!transactionCost) {
        return { cost: 0, hasData: false };
      }

      const percentageFee = transactionCost.percentage_fee ?? 0;
      const fixedFee = transactionCost.fixed_fee ?? 0;
      const hasData =
        transactionCost.percentage_fee !== undefined || transactionCost.fixed_fee !== undefined;

      return {
        cost: (percentageFee / 100) * amount + fixedFee,
        hasData,
      };
    };

    const fromCost = calculateCost(fromId);
    const toCost = calculateCost(toId);
    const hasCostData = fromCost.hasData || toCost.hasData;
    const savings = hasCostData ? Math.max(fromCost.cost - toCost.cost, 0) : null;
    const formattedSavings =
      savings !== null ? thousandize(Math.round(savings), formattingLocale) : null;

    return activeNudge.message.replace(/\{savings\}/g, formattedSavings ?? "–");
  }, [activeNudge, donation.sum, paymentMethods, formattingLocale]);

  useEffect(() => {
    if (!activeNudge?.to_method?._id || !paymentOptionsRef.current) {
      setNudgeArrowLeft(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = paymentOptionsRef.current!.querySelector<HTMLElement>(
        `[data-method-id="${activeNudge.to_method?._id}"]`,
      );
      if (target) {
        const containerRect = paymentOptionsRef.current!.getBoundingClientRect();
        const childOfContainer = paymentOptionsRef.current!.querySelector("div");
        const radioButtonChoices = childOfContainer!.querySelectorAll("label");
        console.log(radioButtonChoices);
        let offset = 0;
        for (const radioButtonChoice of Array.from(radioButtonChoices)) {
          console.log(`Checking radio button`, radioButtonChoice);
          if (radioButtonChoice.dataset.methodId === activeNudge.to_method?._id) {
            console.log(`Found the target radio button choice at offset ${offset}`);
            break;
          }
          console.log(`Adding ${radioButtonChoice.clientWidth} to offset`);
          offset += radioButtonChoice.clientWidth;
          console.log(`New offset: ${offset}`);
        }
        // Circle is 1.5em wide, so to get to the center of the circle, we need to add 0.75em
        setNudgeArrowLeft(offset + 0.75 * 20 + 20);
      } else {
        setNudgeArrowLeft(null);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [activeNudge?.to_method?._id, paymentMethods, selectedPaymentMethodId]);

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Format CPR input for Danish locale
    if (locale === "dk" && taxDeductionChecked) {
      const formattedValue = formatTinInput(value, { allowCvr: true });
      e.target.value = formattedValue;
    }
  };

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
                if (typeof window.fbq != "undefined" && window.fbq !== null) {
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
          if (typeof window.fbq !== "undefined" && window.fbq !== null) {
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
              name: text.show_name_field ? capitalizeNames(data.name.trim()) : "",
              email: data.email.trim().toLowerCase(),
              taxDeduction: data.taxDeduction,
              ssn: data.taxDeduction ? data.ssn.toString().trim() : "",
              newsletter: data.newsletter,
            },
      ),
    );

    dispatch(selectPaymentMethod(data.method || PaymentMethod.BANK));

    if (isAnonymous || donation.errors.length === 0) {
      const configuration = paymentMethodConfigurations.find(
        (config) =>
          config.id ===
          paymentMethods.find((method) => paymentMethodMap[method._id] === data.method)?._id,
      );
      dispatch(
        registerDonationAction.started({
          openExternalPaymentOnRegisterSuccess: configuration?.openExternalPaymentOnRegisterSuccess,
        }),
      );
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
                          validate: (val, formValues) => {
                            if (formValues.isAnonymous || !taxDeductionChecked) return true;
                            const trimmed = val.toString().trim();

                            if (locale === "no") {
                              return validateSsnNo(trimmed);
                            } else if (locale === "sv") {
                              return validateSsnSe(trimmed);
                            } else if (locale === "dk") {
                              const validationResult = validateTin(trimmed, { allowCvr: true });
                              if (validationResult.type === "CPR") {
                                if (validationResult.isSuspicious) {
                                  setCprSuspicious(true);
                                  return true;
                                } else if (
                                  validationResult.isValid &&
                                  !validationResult.isSuspicious
                                ) {
                                  setCprSuspicious(false);
                                }
                              } else {
                                setCprSuspicious(false);
                              }
                              return validationResult.isValid;
                            }

                            // Unknown locale
                            return true;
                          },
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

            <Controller
              control={control}
              name="method"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <div ref={paymentOptionsRef}>
                  <RadioButtonGroup
                    options={paymentMethods.map((method) => ({
                      title: method.selector_text,
                      value: paymentMethodMap[method._id],
                      data_cy: `${method._id}-method`,
                      data_id: method._id,
                    }))}
                    selected={field.value}
                    onSelect={(option) => {
                      field.onChange(option);
                    }}
                  />
                </div>
              )}
            />
            <PaymentNudgeContainer>
              <AnimateHeight
                height={activeNudge && nudgeMessageText ? "auto" : 0}
                animateOpacity
                duration={250}
              >
                {activeNudge && nudgeMessageText && (
                  <PaymentNudgeWrapper
                    style={
                      nudgeArrowLeft !== null
                        ? ({
                            ["--nudge-arrow-left" as string]: `${nudgeArrowLeft}px`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <PaymentNudge>
                      <Info size={22} />
                      <div>
                        <p>{nudgeMessageText}</p>
                      </div>
                    </PaymentNudge>
                  </PaymentNudgeWrapper>
                )}
              </AnimateHeight>
            </PaymentNudgeContainer>
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

export const paymentMethodIdMap: Partial<Record<PaymentMethod, PaymentMethodId>> = {
  [PaymentMethod.VIPPS]: "vipps",
  [PaymentMethod.BANK]: "bank",
  [PaymentMethod.SWISH]: "swish",
  [PaymentMethod.AUTOGIRO]: "autogiro",
  [PaymentMethod.AVTALEGIRO]: "avtalegiro",
  [PaymentMethod.QUICKPACK_MOBILEPAY]: "quickpay_mobilepay",
  [PaymentMethod.QUICKPAY_CARD]: "quickpay_card",
  [PaymentMethod.DKBANK]: "dkbank",
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

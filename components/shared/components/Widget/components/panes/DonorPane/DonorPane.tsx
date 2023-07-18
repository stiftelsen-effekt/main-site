import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import React, { FormEvent, FormEventHandler, useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Validate from "validator";
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

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC<{
  text: WidgetPane2Props;
  paymentMethods: NonNullable<WidgetProps["methods"]>;
}> = ({ text, paymentMethods }) => {
  const dispatch = useDispatch();
  const donor = useSelector((state: State) => state.donation.donor);
  const method = useSelector((state: State) => state.donation.method);
  const donation = useSelector((state: State) => state.donation);
  const { donor: initialDonor } = useContext(DonorContext);

  const {
    register,
    watch,
    formState: { errors },
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
    },
  });

  const plausible = usePlausible();

  const taxDeductionChecked = watch("taxDeduction");
  const newsletterChecked = watch("newsletter");
  const isAnonymous = watch("isAnonymous");

  const nextDisabled = useMemo(() => {
    return (!isAnonymous && Object.keys(errors).length > 0) || !method;
  }, [isAnonymous, errors, method]);

  const paneSubmitted = handleSubmit((data) => {
    if (!isAnonymous) {
      plausible("SubmitDonorPane", {
        props: {
          donorType: isAnonymous ? 0 : 1,
          taxDeduction: data.taxDeduction,
          newsletter: data.newsletter,
          method: method,
        },
      });

      if (donation.recurring) {
        if (method === PaymentMethod.VIPPS) plausible("SelectVippsRecurring");
        if (method === PaymentMethod.BANK) plausible("SelectAvtaleGiro");
      }
      if (!donation.recurring) {
        if (method === PaymentMethod.VIPPS) plausible("SelectSingleVippsPayment");
        if (method === PaymentMethod.BANK) {
          plausible("SelectBankSingle");
          plausible("CompleteDonation");
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

    if ((isAnonymous || donation.isValid) && !nextDisabled) {
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
                  {errors.name && <ErrorField text="Ugyldig navn" />}
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
                        return Validate.isEmail(trimmed);
                      },
                    })}
                  />
                  {errors.email && <ErrorField text="Ugyldig epost" />}
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
                    </CheckBoxWrapper>
                    {taxDeductionChecked && <ToolTip text={text.tax_deduction_tooltip_text} />}
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
                              return (
                                !taxDeductionChecked ||
                                (Validate.isInt(trimmed) &&
                                  // Check if valid norwegian org or SSN (Social security number) based on check sum
                                  // Also accepts D numbers (which it probably should) and H numbers (which it probably should not)
                                  ((trimmed.length === 9 && validateOrg(trimmed)) ||
                                    (trimmed.length === 11 && validateSsn(trimmed))))
                              );
                            },
                          })}
                        />
                        {errors.ssn && <ErrorField text="Ugyldig fødselsnummer eller org.nr." />}
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
                  <div style={{ marginTop: "10px" }}>
                    {text.privacy_policy_text}{" "}
                    <Link href={"/personvern"} passHref>
                      <a style={{ textDecoration: "underline" }} target={"_blank"}>
                        personvernserklæring ↗
                      </a>
                    </Link>
                  </div>
                </CheckBoxGroupWrapper>
              </>
            ) : null}

            <RadioButtonGroup
              options={paymentMethods.map((method) => ({
                title: method.selector_text,
                value: {
                  vipps: PaymentMethod.VIPPS,
                  bank: PaymentMethod.BANK,
                  swish: PaymentMethod.SWISH,
                }[method._id],
                data_cy: `${method._id}-method`,
              }))}
              selected={method}
              onSelect={(option) => dispatch(selectPaymentMethod(option))}
            />
          </div>
          <ActionBar data-cy="next-button-div">
            <NextButton disabled={nextDisabled} type="submit">
              {text.pane2_button_text}
            </NextButton>
          </ActionBar>
        </PaneContainer>
      </DonorForm>
    </Pane>
  );
};

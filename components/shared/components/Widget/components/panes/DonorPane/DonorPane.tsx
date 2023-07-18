import React, { FormEvent, FormEventHandler, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Validate from "validator";
import { validateSsn, validateOrg } from "@ssfbank/norwegian-id-validators";
import { useForm } from "react-hook-form";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { DonorInput, State } from "../../../store/state";
import {
  registerDonationAction,
  selectPaymentMethod,
  submitDonorInfo,
} from "../../../store/donation/actions";
import { InputFieldWrapper, HiddenCheckBox, CheckBoxWrapper } from "../Forms.style";
import { DonorForm, ActionBar, CheckBoxGroupWrapper } from "./DonorPane.style";
import { DonorType } from "../../../types/Temp";
import { CustomCheckBox } from "./CustomCheckBox";
import { ErrorField } from "../../shared/Error/ErrorField";
import { PaymentMethod } from "../../../types/Enums";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import Link from "next/link";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { Donor } from "../../../../../../../models";
import { DonorContext } from "../../../../../../profile/layout/donorProvider";
import { WidgetPane2Props, WidgetProps } from "../../../types/WidgetProps";
import { usePlausible } from "next-plausible";
import { ANONYMOUS_DONOR } from "../../../config/anonymous-donor";

interface DonorFormValues extends DonorInput {}

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
  const [profileDonor] = useState<Donor | null>(initialDonor);

  const [nextDisabled, setNextDisabled] = useState(true);
  const [newsletterChecked, setNewsletterChecked] = useState(
    donor?.newsletter ? donor.newsletter : false,
  );
  const [taxDeductionChecked, setTaxDeductionChecked] = useState(
    donor?.taxDeduction ? donor.taxDeduction : false,
  );
  const [donorType, setDonorType] = useState<DonorType>(
    donor?.email === ANONYMOUS_DONOR.email ? DonorType.ANONYMOUS : DonorType.DONOR,
  );
  const { register, watch, errors, handleSubmit, clearErrors, setValue } = useForm<DonorFormValues>(
    {
      defaultValues: {
        taxDeduction: donor?.taxDeduction,
        newsletter: donor?.newsletter,
      },
    },
  );

  const plausible = usePlausible();
  const taxDeduction = watch("taxDeduction");

  useEffect(() => {
    if (donorType === DonorType.ANONYMOUS) {
      setNextDisabled(false);
    } else if (Object.keys(errors).length === 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
      return;
    }

    if (typeof method === "undefined") {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [donorType, method, dispatch, errors, taxDeduction]);

  const paneSubmitted: FormEventHandler = (event) =>
    donorType === DonorType.DONOR ? submitDonor(event) : submitAnonymous(event);

  const submitDonor = handleSubmit((data) => {
    plausible("SubmitDonorPane", {
      props: {
        donorType: donorType,
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

    dispatch(
      submitDonorInfo(
        data.name ? capitalizeNames(data.name.trim()) : "",
        data.email ? data.email.trim().toLowerCase() : "",
        data.taxDeduction ? data.taxDeduction : false,
        data.taxDeduction && data.ssn ? data.ssn.toString().trim() : "",
        data.newsletter ? data.newsletter : false,
      ),
    );

    if (donation.isValid && !nextDisabled) {
      dispatch(registerDonationAction.started(undefined));
    } else {
      alert("Donation invalid");
    }
  });

  const submitAnonymous = (event: FormEvent) => {
    event.preventDefault();
    dispatch(
      submitDonorInfo(
        ANONYMOUS_DONOR.name,
        ANONYMOUS_DONOR.email,
        ANONYMOUS_DONOR.taxDeduction,
        ANONYMOUS_DONOR.ssn,
        ANONYMOUS_DONOR.newsletter,
      ),
    );

    if (!nextDisabled) {
      dispatch(registerDonationAction.started(undefined));
    } else {
      alert("Donation invalid");
    }
  };

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
                  name="anonymousDonor"
                  type="checkbox"
                  checked={donorType === DonorType.ANONYMOUS ? true : false}
                  ref={register}
                  onChange={() => {
                    if (donorType === DonorType.DONOR) setDonorType(DonorType.ANONYMOUS);
                    else setDonorType(DonorType.DONOR);
                    (document.activeElement as HTMLElement).blur();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (donorType === DonorType.DONOR) setDonorType(DonorType.ANONYMOUS);
                      else setDonorType(DonorType.DONOR);
                      e.preventDefault();
                    }
                  }}
                />
                <CustomCheckBox
                  label={text.anon_button_text}
                  checked={donorType === DonorType.ANONYMOUS}
                />
              </CheckBoxWrapper>
            </div>

            <div style={{ display: donorType === DonorType.ANONYMOUS ? "none" : "block" }}>
              <InputFieldWrapper>
                <input
                  data-cy="name-input"
                  name="name"
                  type="text"
                  placeholder={text.name_placeholder}
                  defaultValue={
                    donor?.name === ANONYMOUS_DONOR.name
                      ? ""
                      : profileDonor?.name
                      ? profileDonor?.name
                      : donor?.name
                  }
                  ref={register({ required: true, minLength: 3 })}
                />
                {errors.name && <ErrorField text="Ugyldig navn" />}
              </InputFieldWrapper>
              <InputFieldWrapper>
                <input
                  data-cy="email-input"
                  name="email"
                  type="email"
                  placeholder={text.email_placeholder}
                  defaultValue={
                    donor?.email === ANONYMOUS_DONOR.email
                      ? ""
                      : profileDonor?.email
                      ? profileDonor?.email
                      : donor?.email
                  }
                  ref={register({
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
                      name="taxDeduction"
                      type="checkbox"
                      ref={register}
                      onChange={() => {
                        if (!taxDeductionChecked) clearErrors(["ssn"]);
                        setTaxDeductionChecked(!taxDeductionChecked);
                        (document.activeElement as HTMLElement).blur();
                      }}
                      onKeyDown={(e) => {
                        if (!taxDeductionChecked) clearErrors(["ssn"]);
                        if (e.key === "Enter" || e.key === " ") {
                          setTaxDeductionChecked(!taxDeductionChecked);
                          e.preventDefault();
                        }
                      }}
                    />
                    <CustomCheckBox
                      label={text.tax_deduction_selector_text}
                      checked={taxDeductionChecked}
                    />
                  </CheckBoxWrapper>
                  {taxDeductionChecked && <ToolTip text={text.tax_deduction_tooltip_text} />}
                  {taxDeduction && (
                    <InputFieldWrapper>
                      <input
                        data-cy="ssn-input"
                        name="ssn"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder={text.tax_deduction_ssn_placeholder}
                        defaultValue={
                          // Hide SSN if anonymous donor
                          donor?.ssn === ANONYMOUS_DONOR.ssn ? "" : donor?.ssn
                        }
                        ref={register({
                          required: false,
                          validate: (val) => {
                            const trimmed = val.toString().trim();
                            return (
                              !taxDeduction ||
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
                    name="newsletter"
                    type="checkbox"
                    ref={register}
                    onChange={() => {
                      (document.activeElement as HTMLElement).blur();
                      setNewsletterChecked(!newsletterChecked);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setNewsletterChecked(!newsletterChecked);
                        e.preventDefault();
                      }
                    }}
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
            </div>

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

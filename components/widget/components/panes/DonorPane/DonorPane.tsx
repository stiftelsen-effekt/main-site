import React, { useEffect, useState } from "react";
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
import { RadioButtonGroup } from "../../../../elements/radiobuttongroup";
import { PaymentMethod } from "../../../types/Enums";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import Link from "next/link";
import { ToolTip } from "../../shared/ToolTip/ToolTip";

interface DonorFormValues extends DonorInput {}

const tooltipText =
  "Gjelder donasjoner mellom 500 og 25 000 kr per år. Vi rapporterer direkte til Skatteetaten og trenger derfor fødsel- eller organisasjonsnummer til donor.";

const anonDonor: DonorFormValues = {
  name: "Anonym Giver",
  email: "anon@gieffektivt.no",
  taxDeduction: false,
  ssn: "12345678910",
  newsletter: false,
};

// Capitalizes each first letter of all first, middle and last names
const capitalizeNames = (string: string) => {
  return string.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
};

export const DonorPane: React.FC = () => {
  const dispatch = useDispatch();
  const donor = useSelector((state: State) => state.donation.donor);
  const method = useSelector((state: State) => state.donation.method);
  const donation = useSelector((state: State) => state.donation);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [nameErrorAnimation, setNameErrorAnimation] = useState(false);
  const [emailErrorAnimation, setEmailErrorAnimation] = useState(false);
  const [ssnErrorAnimation, setSsnErrorAnimation] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(
    donor?.newsletter ? donor.newsletter : false,
  );
  const [taxDeductionChecked, setTaxDeductionChecked] = useState(
    donor?.taxDeduction ? donor.taxDeduction : false,
  );
  const [donorType, setDonorType] = useState<DonorType>(
    donor?.email === "anon@gieffektivt.no" ? DonorType.ANONYMOUS : DonorType.DONOR,
  );
  const { register, watch, errors, handleSubmit, clearErrors, setValue } =
    useForm<DonorFormValues>();
  const watchAllFields = watch();

  useEffect(() => {
    setValue("taxDeduction", donor?.taxDeduction);
    setValue("newsletter", donor?.newsletter);
  }, []);

  useEffect(() => {
    errors.name ? setNameErrorAnimation(true) : setNameErrorAnimation(false);
    errors.email ? setEmailErrorAnimation(true) : setEmailErrorAnimation(false);
    errors.ssn ? setSsnErrorAnimation(true) : setSsnErrorAnimation(false);

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
  }, [donorType, method, dispatch, errors, watchAllFields]);

  const paneSubmitted = (data: DonorFormValues) => {
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
  };

  const submitAnonymous = () => {
    dispatch(
      submitDonorInfo(
        anonDonor.name ? anonDonor.name : "",
        anonDonor.email ? anonDonor.email : "",
        anonDonor.taxDeduction ? anonDonor.taxDeduction : false,
        anonDonor.ssn ? anonDonor.ssn : "",
        anonDonor.newsletter ? anonDonor.newsletter : false,
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
      <DonorForm onSubmit={handleSubmit(paneSubmitted)} autoComplete="on">
        <PaneContainer>
          <div>
            <PaneTitle>Om deg</PaneTitle>

            <div style={{ marginBottom: "20px" }}>
              <CheckBoxWrapper>
                <HiddenCheckBox
                  data-cy="checkboxAnonymousDonor"
                  name="anonymousDonor"
                  type="checkbox"
                  ref={register}
                  onChange={(e) => {
                    if (donorType === DonorType.DONOR) setDonorType(DonorType.ANONYMOUS);
                    else setDonorType(DonorType.DONOR);
                    (document.activeElement as HTMLElement).blur();
                  }}
                />
                <CustomCheckBox label="Doner anonymt" checked={donorType === DonorType.ANONYMOUS} />
              </CheckBoxWrapper>
            </div>

            <div style={{ display: donorType === DonorType.ANONYMOUS ? "none" : "block" }}>
              <InputFieldWrapper>
                <input
                  name="name"
                  type="text"
                  placeholder="Navn"
                  defaultValue={donor?.name === "Anonym Giver" ? "" : donor?.name}
                  ref={register({ required: true, minLength: 3 })}
                />
                {nameErrorAnimation && <ErrorField text="Ugyldig navn" />}
              </InputFieldWrapper>
              <InputFieldWrapper>
                <input
                  name="email"
                  type="email"
                  placeholder="Epost"
                  defaultValue={donor?.email === "anon@gieffektivt.no" ? "" : donor?.email}
                  ref={register({
                    required: true,
                    validate: (val) => {
                      const trimmed = val.trim();
                      return Validate.isEmail(trimmed);
                    },
                  })}
                />
                {emailErrorAnimation && <ErrorField text="Ugyldig epost" />}
              </InputFieldWrapper>
              <CheckBoxGroupWrapper>
                <div>
                  <CheckBoxWrapper>
                    <HiddenCheckBox
                      data-cy="checkboxTaxDeduction"
                      name="taxDeduction"
                      type="checkbox"
                      ref={register}
                      onChange={(e) => {
                        !e.target.checked && clearErrors(["ssn"]);
                        setTaxDeductionChecked(!taxDeductionChecked);
                        (document.activeElement as HTMLElement).blur();
                      }}
                    />
                    <CustomCheckBox
                      label="Jeg ønsker skattefradrag"
                      checked={taxDeductionChecked}
                    />
                  </CheckBoxWrapper>
                  {taxDeductionChecked && <ToolTip text={tooltipText} />}
                  {watchAllFields.taxDeduction && (
                    <InputFieldWrapper>
                      <input
                        name="ssn"
                        type="text"
                        inputMode="numeric"
                        placeholder="Fødselsnummer eller org.nr."
                        defaultValue={
                          // Hide SSN if anonymous donor
                          donor?.ssn === "12345678910" ? "" : donor?.ssn
                        }
                        ref={register({
                          required: false,
                          validate: (val) => {
                            const trimmed = val.toString().trim();
                            return (
                              !watchAllFields.taxDeduction ||
                              (Validate.isInt(trimmed) &&
                                // Check if valid norwegian org or SSN (Social security number) based on check sum
                                // Also accepts D numbers (which it probably should) and H numbers (which it probably should not)
                                ((trimmed.length === 9 && validateOrg(trimmed)) ||
                                  (trimmed.length === 11 && validateSsn(trimmed))))
                            );
                          },
                        })}
                      />
                      {ssnErrorAnimation && (
                        <ErrorField text="Ugyldig fødselsnummer eller org.nr." />
                      )}
                    </InputFieldWrapper>
                  )}
                </div>
                <CheckBoxWrapper>
                  <HiddenCheckBox
                    data-cy="checkboxNewsletter"
                    name="newsletter"
                    type="checkbox"
                    ref={register}
                    onChange={() => {
                      (document.activeElement as HTMLElement).blur();
                      setNewsletterChecked(!newsletterChecked);
                    }}
                  />
                  <CustomCheckBox
                    label="Jeg ønsker å melde meg på nyhetsbrevet"
                    mobileLabel="Jeg vil melde meg på nyhetsbrevet"
                    checked={newsletterChecked}
                  />
                </CheckBoxWrapper>
                <div style={{ marginTop: "10px" }}>
                  Her finner du vår{" "}
                  <Link href={"/personvern"} passHref>
                    <a style={{ textDecoration: "underline" }} target={"_blank"}>
                      personvernserklæring ↗
                    </a>
                  </Link>
                </div>
              </CheckBoxGroupWrapper>
            </div>

            <RadioButtonGroup
              options={[
                { title: "Gi med bank", value: PaymentMethod.BANK },
                { title: "Gi med Vipps", value: PaymentMethod.VIPPS },
              ]}
              selected={method}
              onSelect={(option) => dispatch(selectPaymentMethod(option))}
            />
          </div>
          <ActionBar>
            {donorType === DonorType.DONOR ? (
              <NextButton disabled={nextDisabled} onClick={() => {}}>
                Neste
              </NextButton>
            ) : null}
            {donorType === DonorType.ANONYMOUS ? (
              <NextButton disabled={nextDisabled} onClick={submitAnonymous}>
                Neste
              </NextButton>
            ) : null}
          </ActionBar>
        </PaneContainer>
      </DonorForm>
    </Pane>
  );
};

/**
 * type="submit" on donor button
 * disabled={nextDisabled}
 */

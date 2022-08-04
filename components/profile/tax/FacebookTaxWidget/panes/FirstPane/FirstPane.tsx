/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Validate from "validator";
import { useForm } from "react-hook-form";
import { Pane } from "../Panes.style";
import {
  CheckBoxWrapper,
  HiddenCheckBox,
  InputFieldWrapper,
} from "../Forms.style";
import { DonorForm } from "../SecondPane/DonorPane.style";
import { NextButton } from "../../shared/Buttons/NavigationButtons.style";
import { nextPane } from "../../../store/layout/actions";
import { TextInput } from "../../shared/Input/TextInput";
import { ErrorField } from "../../shared/Error/ErrorField";
import { InfoText } from "./MethodPane.style";
import { registerPaymentAction } from "../../../store/paymentInfo/actions";
import { LoadingCircle } from "../../shared/LoadingCircle/LoadingCircle";
import { CustomCheckBox } from "./CustomCheckBox";

interface FormValues {
  email: string;
  paymentID: string;
  name: string;
  ssn: string;
  newsletter: boolean;
}

export const FirstPane: React.FC = () => {
  const dispatch = useDispatch();
  const [nextDisabled, setNextDisabled] = useState(true);
  const [paymentIDError, setPaymentIDError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ssnError, setSsnError] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);

  const { register, watch, errors, handleSubmit } = useForm<FormValues>();
  const watchAllFields = watch();

  useEffect(() => {
    errors.paymentID ? setPaymentIDError(true) : setPaymentIDError(false);
    errors.email ? setEmailError(true) : setEmailError(false);
    errors.name ? setNameError(true) : setNameError(false);
    errors.ssn ? setSsnError(true) : setSsnError(false);

    if (Object.keys(errors).length === 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, [dispatch, errors, watchAllFields]);

  const paneSubmitted = () => {
    setLoadingAnimation(true);
    dispatch(
      registerPaymentAction.started({
        paymentID: watchAllFields.paymentID,
        email: watchAllFields.email,
        full_name: watchAllFields.name,
        ssn: watchAllFields.ssn,
        newsletter: watchAllFields.newsletter === true ? "1" : "0",
      })
    );
    dispatch(nextPane());
  };

  return (
    <Pane>
      <InfoText>
        Fyll ut skjemaet for å få skattefradrag for dine Facebook-donasjoner
      </InfoText>
      {!loadingAnimation && (
        <DonorForm onSubmit={handleSubmit(paneSubmitted)}>
          <InputFieldWrapper>
            <TextInput
              name="name"
              type="text"
              placeholder="Navn"
              innerRef={register({
                required: true,
                validate: (val: string) => {
                  const trimmed = val.trim();
                  return trimmed.length > 2;
                },
              })}
            />
            {nameError && <ErrorField text="Ugyldig navn" />}
            <TextInput
              name="email"
              type="text"
              placeholder="Epost"
              innerRef={register({
                required: true,
                validate: (val: string) => {
                  const trimmed = val.trim();
                  return Validate.isEmail(trimmed);
                },
              })}
            />
            {emailError && <ErrorField text="Ugyldig epost" />}
            <TextInput
              name="ssn"
              type="number"
              inputMode="numeric"
              placeholder="Fødselsnummer eller org.nr."
              innerRef={register({
                required: false,
                validate: (val: string) => {
                  const trimmed = val.toString().trim();
                  if (Validate.isInt(trimmed)) {
                    return trimmed.length === 9 || trimmed.length === 11;
                  }
                  return false;
                },
              })}
            />
            {ssnError && (
              <ErrorField text="Må være 11 (f.nr.) eller 9 (org.nr.) siffer" />
            )}
            <TextInput
              name="paymentID"
              type="number"
              placeholder="Betalings-ID (Facebook)"
              innerRef={register({
                required: true,
                minLength: 16,
                maxLength: 16,
              })}
            />
            {paymentIDError && (
              <ErrorField text="Betalings-ID må være 16 siffer" />
            )}
          </InputFieldWrapper>
          <CheckBoxWrapper>
            <HiddenCheckBox
              data-cy="checkboxNewsletter"
              name="newsletter"
              type="checkbox"
              ref={register}
              onChange={() => {
                setNewsletterChecked(!newsletterChecked);
                (document.activeElement as HTMLElement).blur();
              }}
            />
            <CustomCheckBox
              label="Jeg ønsker å melde meg på nyhetsbrevet"
              mobileLabel="Jeg vil melde meg på nyhetsbrevet"
              checked={newsletterChecked}
            />
          </CheckBoxWrapper>

          <NextButton type="submit" disabled={nextDisabled}>
            Neste
          </NextButton>
        </DonorForm>
      )}
      {loadingAnimation && <LoadingCircle />}
    </Pane>
  );
};

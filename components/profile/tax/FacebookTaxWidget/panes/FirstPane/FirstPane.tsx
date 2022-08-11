/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Validate from "validator";
import { useForm } from "react-hook-form";
import { Pane } from "../Panes.style";
import {
  CheckBoxWrapper,
  HiddenCheckBox,
} from "../Forms.style";
import { DonorForm } from "../SecondPane/DonorPane.style";
import { CustomCheckBox } from "./CustomCheckBox";
import { NextButton } from "../../../../../main/widget/components/shared/Buttons/NavigationButtons";
import { ErrorField } from "../../../../../main/widget/components/shared/Error/ErrorField";
import { TextInput } from "../../../../../main/widget/components/shared/Input/TextInput";
import { LoadingCircle } from "../../../../../main/widget/components/shared/LoadingCircle/LoadingCircle";
import { nextPane } from "../../../../../main/widget/store/layout/actions";
import { InfoText } from "./MethodPane.style";
import { registerPaymentAction } from "../../../store/paymentInfo/actions";
import { TextInputWrapper } from "../../../../../main/widget/components/shared/Input/TextInput.style";
import { EffektButton, EffektButtonType } from "../../../../../shared/components/EffektButton/EffektButton";
import { InputFieldWrapper } from "../../../../../main/widget/components/panes/Forms.style";

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
    console.log("hey")
    dispatch(
      registerPaymentAction.started({
        paymentID: watchAllFields.paymentID,
        email: watchAllFields.email,
        full_name: watchAllFields.name,
        ssn: watchAllFields.ssn,
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
            <input
              name="name"
              type="text"
              placeholder="Navn"
              ref={register({
                required: true,
                validate: (val: string) => {
                  const trimmed = val.trim();
                  return trimmed.length > 2;
                },
              })}
            />
            </InputFieldWrapper>
            {nameError && <ErrorField text="Ugyldig navn" />}
            <InputFieldWrapper>
              <input
                name="email"
                type="text"
                placeholder="Epost"
                ref={register({
                  required: true,
                  validate: (val: string) => {
                    const trimmed = val.trim();
                    return Validate.isEmail(trimmed);
                  },
                })}
              />
            </InputFieldWrapper>
            {emailError && <ErrorField text="Ugyldig epost" />}
            <InputFieldWrapper>
              <input
                name="ssn"
                type="number"
                inputMode="numeric"
                placeholder="Fødselsnummer eller org.nr."
                ref={register({
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
            </InputFieldWrapper>
            {ssnError && (
              <ErrorField text="Må være 11 (f.nr.) eller 9 (org.nr.) siffer" />
            )}
            <InputFieldWrapper>
              <input
                name="paymentID"
                type="number"
                placeholder="Betalings-ID (Facebook)"
                ref={register({
                  required: true,
                  minLength: 16,
                  maxLength: 16,
                })}
              />
            </InputFieldWrapper>
            {paymentIDError && (
              <ErrorField text="Betalings-ID må være 16 siffer" />
            )}
          <button type="submit" disabled={nextDisabled}>
            Neste
          </button>
        </DonorForm>
      )}
      {loadingAnimation && <LoadingCircle />}
    </Pane>
  );
};

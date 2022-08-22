import React, { useEffect, useState } from "react";
import {
  InfoText,
  InputFieldWrapper,
  LoadingButtonSpinner,
  SubmitButton,
  TaxInput,
} from "./Forms.style";
import styles from "./FacebookTaxWidget.module.scss";
import { useForm } from "react-hook-form";
import { ErrorField } from "./ErrorField";
import Validate from "validator";
import { EffektButtonType } from "../../../shared/components/EffektButton/EffektButton";
import { toast } from "react-toastify";
import { AlertCircle, Check } from "react-feather";
import { FacebookDonationRegistration } from "../../../../models";
import { useAuth0 } from "@auth0/auth0-react";
import { registerFacebookDonation } from "../../_queries";

export const FacebookTaxWidget: React.FC<{ name: string | null; email: string | null }> = ({
  name,
  email,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [nextDisabled, setNextDisabled] = useState(true);
  const [paymentIDError, setPaymentIDError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ssnError, setSsnError] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(false);

  const { register, watch, errors, handleSubmit, reset } = useForm<FacebookDonationRegistration>();
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
  }, [errors, watchAllFields]);

  const paneSubmitted = () => {
    setLoadingAnimation(true);
    getAccessTokenSilently()
      .then((accessToken) => {
        registerFacebookDonation(watchAllFields, accessToken)
          .then((success) => {
            if (success) {
              successToast("Registrert");
              setLoadingAnimation(false);
              reset();
            } else {
              failureToast("Noe gikk galt");
              setLoadingAnimation(false);
            }
          })
          .catch(() => {
            failureToast("Noe gikk galt");
            setLoadingAnimation(false);
          });
      })
      .catch((error) => {
        failureToast("Ikke autentisert");
        setLoadingAnimation(false);
      });
  };

  return (
    <div className={styles.container}>
      <InfoText>Fyll ut skjemaet for å få skattefradrag for dine Facebook-donasjoner</InfoText>
      <form onSubmit={handleSubmit(paneSubmitted)}>
        <InputFieldWrapper>
          <label htmlFor="name">Ditt navn</label>
          <TaxInput
            name="name"
            type="text"
            defaultValue={name || ""}
            ref={register({
              required: true,
              validate: (val: string) => {
                const trimmed = val.trim();
                return trimmed.length > 2;
              },
            })}
          />
          {nameError && <ErrorField text="Ugyldig navn" />}
        </InputFieldWrapper>

        <InputFieldWrapper>
          <label htmlFor="email">E-post</label>
          <TaxInput
            name="email"
            type="text"
            defaultValue={email || ""}
            ref={register({
              required: true,
              validate: (val: string) => {
                const trimmed = val.trim();
                return Validate.isEmail(trimmed);
              },
            })}
          />
          {emailError && <ErrorField text="Ugyldig epost" />}
        </InputFieldWrapper>

        <InputFieldWrapper>
          <label htmlFor="ssn">Fødselsnummer / Organisasjonsnummer</label>
          <TaxInput
            name="ssn"
            type="number"
            inputMode="numeric"
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
          {ssnError && <ErrorField text="Må være 11 (f.nr.) eller 9 (org.nr.) siffer" />}
        </InputFieldWrapper>

        <InputFieldWrapper>
          <label htmlFor="paymentID">Betalings-ID (facebook)</label>
          <TaxInput
            name="paymentID"
            type="number"
            ref={register({
              required: true,
              minLength: 16,
              maxLength: 16,
            })}
          />
          {paymentIDError && <ErrorField text="Betalings-ID må være 16 siffer" />}
        </InputFieldWrapper>

        <SubmitButton
          onClick={() => {
            handleSubmit(paneSubmitted);
          }}
          type={EffektButtonType.PRIMARY}
          disabled={nextDisabled}
        >
          {loadingAnimation ? <LoadingButtonSpinner /> : "Registrer"}
        </SubmitButton>
      </form>
    </div>
  );
};

const successToast = (msg: string) =>
  toast.success(msg, { icon: <Check size={24} color={"black"} /> });
const failureToast = (msg: string) =>
  toast.error(msg, { icon: <AlertCircle size={24} color={"black"} /> });

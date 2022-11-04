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
import { FacebookDonationRegistration, TaxUnit } from "../../../../models";
import { useAuth0 } from "@auth0/auth0-react";
import { registerFacebookDonation } from "../../_queries";
import { TaxUnitSelector } from "../../shared/TaxUnitSelector/TaxUnitSelector";
import { TaxUnitCreateModal } from "../../shared/TaxUnitModal/TaxUnitCreateModal";

export const FacebookTaxWidget: React.FC<{ email: string }> = ({ email }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [nextDisabled, setNextDisabled] = useState(true);
  const [paymentIDError, setPaymentIDError] = useState(false);
  const [taxUnit, setTaxUnit] = useState<TaxUnit | null>(null);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [createTaxUnitModalOpen, setCreateTaxUnitModalOpen] = useState(false);

  const { register, watch, errors, handleSubmit, reset } = useForm<{ paymentID: string }>();
  const watchAllFields = watch();

  useEffect(() => {
    errors.paymentID ? setPaymentIDError(true) : setPaymentIDError(false);

    if (Object.keys(errors).length === 0 && taxUnit !== null) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, [errors, watchAllFields, taxUnit]);

  const paneSubmitted = () => {
    if (!taxUnit) return;
    setLoadingAnimation(true);
    getAccessTokenSilently()
      .then((accessToken) => {
        registerFacebookDonation(
          {
            name: taxUnit.name,
            email: email,
            ssn: taxUnit.ssn,
            paymentID: watchAllFields.paymentID,
          },
          accessToken,
        )
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
      <form onSubmit={handleSubmit(paneSubmitted)}>
        <InputFieldWrapper>
          <TaxUnitSelector
            selected={taxUnit}
            onChange={(taxUnit: TaxUnit) => setTaxUnit(taxUnit)}
            onAddNew={() => setCreateTaxUnitModalOpen(true)}
          ></TaxUnitSelector>
        </InputFieldWrapper>

        <InputFieldWrapper>
          <label htmlFor="paymentID">Betalings-ID fra Facebook</label>
          <TaxInput
            name="paymentID"
            type="number"
            ref={register({
              required: true,
              minLength: 16,
              maxLength: 16,
            })}
          />
          <span style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}>
            Betalings-ID må være 16 siffer
          </span>
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
      {createTaxUnitModalOpen && (
        <TaxUnitCreateModal
          open={createTaxUnitModalOpen}
          onSuccess={function (unit: TaxUnit): void {
            setTaxUnit(unit);
            setCreateTaxUnitModalOpen(false);
          }}
          onFailure={function (): void {
            setCreateTaxUnitModalOpen(false);
          }}
          onClose={() => setCreateTaxUnitModalOpen(false)}
        />
      )}
    </div>
  );
};

const successToast = (msg: string) =>
  toast.success(msg, { icon: <Check size={24} color={"black"} /> });
const failureToast = (msg: string) =>
  toast.error(msg, { icon: <AlertCircle size={24} color={"black"} /> });

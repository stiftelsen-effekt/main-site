import { useAuth0, User } from "@auth0/auth0-react";
import { useState } from "react";
import { TaxUnit } from "../../../../models";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { RadioButtonGroup } from "../../../shared/components/RadioButton/RadioButtonGroup";
import { createTaxUnit } from "../../_queries";
import { toast } from "react-toastify";

import styles from "./TaxUnitModal.module.scss";
import { AlertCircle, Check } from "react-feather";
import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { useTaxUnits } from "../../../../_queries";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { useMainLocale } from "../../../../context/MainLocaleContext";
import { validateTin, formatTinInput } from "../../../../util/tin-validation";

export enum TaxUnitTypes {
  PERSON = 1,
  COMPANY = 2,
}

export const TaxUnitCreateModal: React.FC<{
  open: boolean;
  onSuccess: (unit: TaxUnit) => void;
  onFailure: () => void;
  onClose: () => void;
}> = ({ open, onSuccess, onFailure, onClose }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const mainLocale = useMainLocale();

  const {
    data: existingUnits,
    loading: loadingUnits,
    isValidating: validatingUnits,
    error: errorLoadingUnits,
  } = useTaxUnits(user as User, getAccessTokenSilently);

  const [name, setName] = useState("");
  const [ssn, setSsn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState(TaxUnitTypes.PERSON);

  const create = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();

    if (!user) {
      return;
    }
    const ssnDigits = ssn.replace(/\D/g, "");
    const result = await createTaxUnit({ name, ssn: ssnDigits }, user, token);

    if (result && typeof result !== "string") {
      successToast();
      onSuccess(result);
      setError("");
    } else if (typeof result === "string") {
      setLoading(false);
      onFailure();
      failureToast();
      setError(result);
    } else {
      setLoading(false);
      onFailure();
      failureToast();
      setError("");
    }
  };

  if (loadingUnits) {
    return <Spinner />;
  }

  const ssnDigits = ssn.replace(/\D/g, "");
  const ssnIsExistingUnit = existingUnits?.some(
    (unit) => unit.ssn.replace(/\D/g, "") === ssnDigits,
  );

  const isDanish = mainLocale === "dk";
  const personDigitCount = isDanish ? 10 : 11;
  const companyDigitCount = isDanish ? 8 : 9;

  const validatePersonId = (val: string): boolean =>
    isDanish ? validateTin(val, { allowCvr: false }).isValid : validateSsn(val);
  const validateCompanyId = (val: string): boolean =>
    isDanish
      ? validateTin(val, { allowCvr: true }).type === "CVR" &&
        validateTin(val, { allowCvr: true }).isValid
      : validateOrg(val);

  const isValid =
    name !== "" &&
    ssn !== "" &&
    (type === TaxUnitTypes.PERSON
      ? ssnDigits.length === personDigitCount && validatePersonId(ssn)
      : ssnDigits.length === companyDigitCount && validateCompanyId(ssn)) &&
    !ssnIsExistingUnit;

  return (
    <Lightbox open={open} onConfirm={create} onCancel={onClose} valid={isValid} loading={loading}>
      <div className={styles.container}>
        <h5>Ny skatteenhet</h5>
        <div className={styles.typeSelector}>
          <RadioButtonGroup
            options={[
              {
                title: "Person",
                value: TaxUnitTypes.PERSON,
                data_cy: "tax-unit-create-modal-type-person",
              },
              {
                title: "Bedrift",
                value: TaxUnitTypes.COMPANY,
                data_cy: "tax-unit-create-modal-type-company",
              },
            ]}
            selected={type}
            onSelect={(type) => {
              setType(type);
            }}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label}>Navn</label>
          <EffektTextInput value={name} onChange={(val) => setName(val)} />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            {type === TaxUnitTypes.PERSON
              ? isDanish
                ? "CPR-nummer"
                : "Fødselsnummer"
              : isDanish
              ? "CVR-nummer"
              : "Organisasjonsnummer"}
          </label>
          <EffektTextInput
            value={ssn}
            onChange={(val: string) =>
              setSsn(
                isDanish ? formatTinInput(val, { allowCvr: type === TaxUnitTypes.COMPANY }) : val,
              )
            }
          />

          <span className={styles.ssnValidation}>
            {ssnDigits.length === personDigitCount &&
              type === TaxUnitTypes.PERSON &&
              !validatePersonId(ssn) &&
              (isDanish ? "Ugyldigt CPR-nummer" : "Ugyldig fødselsnummer")}
            {ssnDigits.length === companyDigitCount &&
              type === TaxUnitTypes.COMPANY &&
              !validateCompanyId(ssn) &&
              (isDanish ? "Ugyldigt CVR-nummer" : "Ugyldig organisasjonsnummer")}
            {ssnDigits.length !== personDigitCount &&
              type === TaxUnitTypes.PERSON &&
              (isDanish ? "10 cifre" : "11 siffer")}
            {ssnDigits.length !== companyDigitCount &&
              type === TaxUnitTypes.COMPANY &&
              (isDanish ? "8 cifre" : "9 siffer")}
            {ssnIsExistingUnit &&
              (isDanish ? "Skatteenhed findes allerede" : "Skatteenhet eksisterer allerede")}
            &nbsp;
          </span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </Lightbox>
  );
};

const successToast = () => toast.success("Lagret", { icon: <Check size={24} color={"black"} /> });
const failureToast = () =>
  toast.error("Noe gikk galt", { icon: <AlertCircle size={24} color={"black"} /> });

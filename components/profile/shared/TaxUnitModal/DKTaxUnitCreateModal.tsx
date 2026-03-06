import { useAuth0, User } from "@auth0/auth0-react";
import { useState } from "react";
import { TaxUnit } from "../../../../models";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { RadioButtonGroup } from "../../../shared/components/RadioButton/RadioButtonGroup";
import { createTaxUnit } from "../../_queries";
import { toast } from "react-toastify";

import styles from "./TaxUnitModal.module.scss";
import { AlertCircle, Check } from "react-feather";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { useTaxUnits } from "../../../../_queries";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { validateTin, formatTinInput } from "../../../../util/tin-validation";
import { TaxUnitTypes } from "./taxUnitTypes";

export const DKTaxUnitCreateModal: React.FC<{
  open: boolean;
  onSuccess: (unit: TaxUnit) => void;
  onFailure: () => void;
  onClose: () => void;
}> = ({ open, onSuccess, onFailure, onClose }) => {
  const { getAccessTokenSilently, user } = useAuth0();

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

  const personDigitCount = 10;
  const companyDigitCount = 8;

  const cprValidation =
    type === TaxUnitTypes.PERSON && ssnDigits.length === personDigitCount
      ? validateTin(ssn, { allowCvr: false })
      : null;

  const validatePersonId = (val: string): boolean => validateTin(val, { allowCvr: false }).isValid;
  const validateCompanyId = (val: string): boolean =>
    validateTin(val, { allowCvr: true }).type === "CVR" &&
    validateTin(val, { allowCvr: true }).isValid;

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
        <h5>Ny skatteenhed</h5>
        <div className={styles.typeSelector}>
          <RadioButtonGroup
            options={[
              {
                title: "Person",
                value: TaxUnitTypes.PERSON,
                data_cy: "tax-unit-create-modal-type-person",
              },
              {
                title: "Virksomhed",
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
            {type === TaxUnitTypes.PERSON ? "CPR-nummer" : "CVR-nummer"}
          </label>
          <EffektTextInput
            value={ssn}
            onChange={(val: string) =>
              setSsn(formatTinInput(val, { allowCvr: type === TaxUnitTypes.COMPANY }))
            }
          />

          <span className={styles.ssnValidation}>
            {cprValidation && !cprValidation.isValid && "Ugyldigt CPR-nummer"}
            {cprValidation?.isValid && cprValidation?.isSuspicious && (
              <span data-cy="cpr-suspicious-message">Kontroller venligst at det er korrekt.</span>
            )}
            {ssnDigits.length === companyDigitCount &&
              type === TaxUnitTypes.COMPANY &&
              !validateCompanyId(ssn) &&
              "Ugyldigt CVR-nummer"}
            {ssnDigits.length !== personDigitCount && type === TaxUnitTypes.PERSON && "10 cifre"}
            {ssnDigits.length !== companyDigitCount && type === TaxUnitTypes.COMPANY && "8 cifre"}
            {ssnIsExistingUnit && "Skatteenhed findes allerede"}
            &nbsp;
          </span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </Lightbox>
  );
};

const successToast = () => toast.success("Gemt", { icon: <Check size={24} color={"black"} /> });
const failureToast = () =>
  toast.error("Noget gik galt", { icon: <AlertCircle size={24} color={"black"} /> });

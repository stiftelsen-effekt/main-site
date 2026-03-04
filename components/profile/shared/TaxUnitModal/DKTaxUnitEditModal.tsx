import { useAuth0, User } from "@auth0/auth0-react";
import { useCallback, useState } from "react";
import { TaxUnit } from "../../../../models";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { RadioButtonGroup } from "../../../shared/components/RadioButton/RadioButtonGroup";
import { updateTaxUnit } from "../../_queries";
import { toast } from "react-toastify";

import styles from "./TaxUnitModal.module.scss";
import { AlertCircle, Check } from "react-feather";
import { useTaxUnits } from "../../../../_queries";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { validateTin, formatTinInput } from "../../../../util/tin-validation";
import { TaxUnitTypes } from "./taxUnitTypes";

export const DKTaxUnitEditModal: React.FC<{
  open: boolean;
  initial: TaxUnit;
  onSuccess: (unit: TaxUnit) => void;
  onFailure: () => void;
  onClose: () => void;
}> = ({ open, initial, onSuccess, onFailure, onClose }) => {
  const { getAccessTokenSilently, user } = useAuth0();

  const {
    data: existingUnits,
    loading: loadingUnits,
    isValidating: validatingUnits,
    error: errorLoadingUnits,
  } = useTaxUnits(user as User, getAccessTokenSilently);

  const initialSsnDigits = initial.ssn.replace(/\D/g, "");
  const [name, setName] = useState(initial.name);
  const [ssn, setSsn] = useState(initial.ssn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState(
    initialSsnDigits.length === 8 ? TaxUnitTypes.COMPANY : TaxUnitTypes.PERSON,
  );

  const create = useCallback(async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();

    if (!user) {
      return;
    }
    const ssnDigits = ssn.replace(/\D/g, "");
    const result = await updateTaxUnit({ ...initial, name: name, ssn: ssnDigits }, user, token);

    if (result && typeof result !== "string") {
      successToast();
      onSuccess(result);
      setError("");
    } else if (typeof result === "string") {
      onFailure();
      failureToast();
      setLoading(false);
      setError(result);
    } else {
      onFailure();
      failureToast();
      setLoading(false);
      setError("");
    }
  }, [name, ssn, user]);

  if (loadingUnits) {
    return <Spinner />;
  }

  const ssnDigits = ssn.replace(/\D/g, "");
  const ssnIsExistingUnit = existingUnits
    ?.filter((unit) => unit !== initial)
    .some((unit) => unit.ssn.replace(/\D/g, "") === ssnDigits);

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
        <h5>Rediger skatteenhed</h5>
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
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            {type === TaxUnitTypes.PERSON ? "CPR-nummer" : "CVR-nummer"}
          </label>
          <input
            className={styles.input}
            value={ssn}
            onChange={(e) =>
              setSsn(formatTinInput(e.target.value, { allowCvr: type === TaxUnitTypes.COMPANY }))
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

import { useAuth0, User } from "@auth0/auth0-react";
import { useCallback, useState } from "react";
import { TaxUnit } from "../../../../models";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { RadioButtonGroup } from "../../../shared/components/RadioButton/RadioButtonGroup";
import { updateTaxUnit } from "../../_queries";
import { toast } from "react-toastify";
import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";

import styles from "./TaxUnitModal.module.scss";
import { AlertCircle, Check } from "react-feather";
import { useTaxUnits } from "../../../../_queries";
import { Spinner } from "../../../shared/components/Spinner/Spinner";

export enum TaxUnitTypes {
  PERSON = 1,
  COMPANY = 2,
}

export const TaxUnitEditModal: React.FC<{
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

  const [name, setName] = useState(initial.name);
  const [ssn, setSsn] = useState(initial.ssn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState(
    initial.ssn.length === 11 ? TaxUnitTypes.PERSON : TaxUnitTypes.COMPANY,
  );

  const create = useCallback(async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();

    if (!user) {
      return;
    }
    const result = await updateTaxUnit({ ...initial, name: name, ssn: ssn }, user, token);

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

  const ssnIsExistingUnit = existingUnits
    ?.filter((unit) => unit != initial)
    .some((unit) => unit.ssn === ssn);
  const isValid =
    name !== "" &&
    ssn !== "" &&
    (type === TaxUnitTypes.PERSON
      ? ssn.length === 11 && validateSsn(ssn)
      : ssn.length === 9 && validateOrg(ssn)) &&
    !ssnIsExistingUnit;
  !validatingUnits;

  return (
    <Lightbox open={open} onConfirm={create} onCancel={onClose} valid={isValid} loading={loading}>
      <div className={styles.container}>
        <h5>Endre skatteenhet</h5>
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
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            {type === TaxUnitTypes.PERSON ? "Fødselsnummer" : "Organisasjonsnummer"}
          </label>
          <input
            className={styles.input}
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
          ></input>

          <span className={styles.ssnValidation}>
            {ssn.length === 11 &&
              type === TaxUnitTypes.PERSON &&
              !validateSsn(ssn) &&
              "Ugyldig fødselsnummer"}
            {ssn.length === 9 &&
              type === TaxUnitTypes.COMPANY &&
              !validateOrg(ssn) &&
              "Ugyldig organisasjonsnummer"}
            {ssn.length !== 11 && type === TaxUnitTypes.PERSON && "11 siffer"}
            {ssn.length !== 9 && type === TaxUnitTypes.COMPANY && "9 siffer"}
            {ssnIsExistingUnit && "Skatteenhet eksisterer allerede"}
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

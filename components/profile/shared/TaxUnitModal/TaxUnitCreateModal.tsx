import { useAuth0, User } from "@auth0/auth0-react";
import { useState } from "react";
import { TaxUnit } from "../../../../models";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { RadioButtonGroup } from "../../../shared/components/RadioButton/RadioButtonGroup";
import { createTaxUnit } from "../../_queries";

import { validateOrg, validateSsn } from "@ssfbank/norwegian-id-validators";
import { useTaxUnits } from "../../../../_queries";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { failureToast, successToast } from "../toast";
import styles from "./TaxUnitModal.module.scss";

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
    const result = await createTaxUnit({ name, ssn }, user, token);

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

  const ssnIsExistingUnit = existingUnits?.some((unit) => unit.ssn === ssn);
  const isValid =
    name !== "" &&
    ssn !== "" &&
    (type === TaxUnitTypes.PERSON
      ? ssn.length === 11 && validateSsn(ssn)
      : ssn.length === 9 && validateOrg(ssn)) &&
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
            {type === TaxUnitTypes.PERSON ? "Fødselsnummer" : "Organisasjonsnummer"}
          </label>
          <EffektTextInput value={ssn} onChange={(val: string) => setSsn(val)} />

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

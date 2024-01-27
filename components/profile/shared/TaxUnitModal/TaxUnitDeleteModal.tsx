import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useState } from "react";
import AnimateHeight from "react-animate-height";
import { TaxUnit } from "../../../../models";
import { EffektCheckbox } from "../../../shared/components/EffektCheckbox/EffektCheckbox";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
import { deleteTaxUnit } from "../../_queries";
import { TaxUnitSelector } from "../TaxUnitSelector/TaxUnitSelector";
import { failureToast, successToast } from "../toast";
import { TaxUnitCreateModal } from "./TaxUnitCreateModal";

import styles from "./TaxUnitModal.module.scss";

export enum TaxUnitTypes {
  PERSON = 1,
  COMPANY = 2,
}

export const TaxUnitDeleteModal: React.FC<{
  open: boolean;
  taxUnit: TaxUnit;
  onSuccess: (success: boolean) => void;
  onFailure: () => void;
  onClose: () => void;
}> = ({ open, taxUnit, onSuccess, onFailure, onClose }) => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTaxUnit, setSelectedTaxUnit] = useState<TaxUnit | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferDonations, setTransferDonations] = useState(false);

  const deleteUnit = useCallback(async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();

    if (!user) {
      return;
    }

    const transferUnit = transferDonations ? selectedTaxUnit : null;

    const result = await deleteTaxUnit({ unit: taxUnit, transferUnit: transferUnit }, user, token);

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
  }, [getAccessTokenSilently, user, taxUnit, selectedTaxUnit, transferDonations]);

  return (
    <Lightbox open={open} onConfirm={deleteUnit} onCancel={onClose} loading={loading}>
      <div className={styles.container}>
        <h5>Slett skatteenhet</h5>

        <div className={styles.inputContainer}>
          {/** Show selector if tax unit has any donations for the current year */}
          <p>
            Du er i ferd med å slette skatteenheten <strong>{taxUnit.name}</strong>.
          </p>

          {taxUnit.taxDeductions?.find((d) => d.year === new Date().getFullYear()) ? (
            <>
              <p>
                Denne skattenheten har donasjoner knyttet til seg for inneværende år. Dersom du
                ønsker kan du overføre disse donasjonene som vi ennå ikke har rapportert til
                skatteetaten til en annen skatteenhet.
              </p>

              <EffektCheckbox
                checked={transferDonations}
                onChange={(checked: boolean) => setTransferDonations(checked)}
              >
                Flytt donasjoner til annen skatteenhet
              </EffektCheckbox>
              <AnimateHeight duration={80} height={transferDonations ? "auto" : 0} animateOpacity>
                <div className={styles.selectorContainer}>
                  <TaxUnitSelector
                    selected={selectedTaxUnit}
                    exclude={[taxUnit]}
                    onChange={(unit) => setSelectedTaxUnit(unit)}
                    onAddNew={() => setCreateModalOpen(true)}
                  />
                </div>
              </AnimateHeight>
            </>
          ) : null}
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
      {createModalOpen && (
        <TaxUnitCreateModal
          open={createModalOpen}
          onSuccess={function (unit): void {
            setSelectedTaxUnit(unit);
            setCreateModalOpen(false);
          }}
          onFailure={function (): void {
            setCreateModalOpen(false);
          }}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </Lightbox>
  );
};

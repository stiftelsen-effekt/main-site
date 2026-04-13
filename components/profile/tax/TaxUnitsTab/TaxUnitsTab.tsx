import { useAuth0, User } from "@auth0/auth0-react";
import { useState } from "react";
import { TaxUnit } from "../../../../models";
import { useTaxUnits } from "../../../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import { TaxUnitMobileList } from "../../shared/lists/taxUnitList/TaxUnitMobileList";
import { TaxUnitCreateModal } from "../../shared/TaxUnitModal/TaxUnitCreateModal";
import styles from "./TaxUnitsTab.module.scss";

interface TaxUnitsTabProps {
  title?: string;
  createButtonLabel?: string;
  emptyStateDescription?: string;
  emptyStateLinkLabel?: string;
}

export const TaxUnitsTab: React.FC<TaxUnitsTabProps> = ({
  title = "Dine skatteenheter",
  createButtonLabel = "Opprett ny skatteenhet",
  emptyStateDescription = "Vi har ikke registrert noen skatteenheter på deg. For å få skattefradrag på donasjoner må du registrere ditt personnummer, eller organisasjonsnummer hvis du donerer fra en skattepliktig bedrift. Du kan registrere flere skatteenheter på samme bruker.",
  emptyStateLinkLabel = "Opprett din første skatteenhet her.",
}) => {
  const { getAccessTokenSilently, user } = useAuth0();

  const { loading, isValidating, data, error } = useTaxUnits(user as User, getAccessTokenSilently);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>{title}</h4>
      {!loading && !error && data ? (
        data.filter((taxUnit) => taxUnit.archived === null).length > 0 ? (
          <>
            <div className={styles.desktopList}>
              {data
                .filter((taxUnit) => taxUnit.archived === null)
                .map((taxUnit) => (
                  <TaxUnitList key={taxUnit.id} taxUnits={[taxUnit]} />
                ))}
            </div>
            <div className={styles.mobileList}>
              <TaxUnitMobileList taxUnits={data.filter((taxUnit) => taxUnit.archived === null)} />
            </div>

            <div className={styles.buttonContainer}>
              <EffektButton onClick={() => setCreateModalOpen(true)}>
                {createButtonLabel}
              </EffektButton>
            </div>
          </>
        ) : (
          <div className={styles.noTaxUnits}>
            <p className={styles.noTaxUnitsText}>{emptyStateDescription}</p>
            <a onClick={() => setCreateModalOpen(true)} className={styles.noTaxUnitsLink}>
              {emptyStateLinkLabel}
            </a>
          </div>
        )
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}

      {createModalOpen && (
        <TaxUnitCreateModal
          open={createModalOpen}
          onSuccess={(unit) => {
            setCreateModalOpen(false);
          }}
          onFailure={() => {}}
          onClose={() => {
            setCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

import { useAuth0, User } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { TaxUnit } from "../../../../models";
import { useTaxUnits } from "../../../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { ActivityContext } from "../../layout/activityProvider";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import { TaxUnitMobileList } from "../../shared/lists/taxUnitList/TaxUnitMobileList";
import { TaxUnitCreateModal } from "../../shared/TaxUnitModal/TaxUnitCreateModal";
import { TaxUnitDeleteModal } from "../../shared/TaxUnitModal/TaxUnitDeleteModal";
import { TaxUnitSelector } from "../../shared/TaxUnitSelector/TaxUnitSelector";
import styles from "./TaxUnitsTab.module.scss";

export const TaxUnitsTab: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { setActivity } = useContext(ActivityContext);

  const { loading, isValidating, data, error } = useTaxUnits(user as User, getAccessTokenSilently);

  // const [selectedTaxUnit, setSelectedTaxUnit] = useState<TaxUnit | null>(data?.[0] ?? null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (isValidating || loading) setActivity(true);
  else setActivity(false);

  return (
    <div className={styles.container}>
      <h5 className={styles.header}>Dine skatteenheter</h5>
      {!loading && !error && data && data.length > 0 ? (
        <>
          <div className={styles.desktopList}>
            {data
              .filter((taxUnit: TaxUnit) => taxUnit.archived === null)
              .map((taxUnit: TaxUnit) => (
                <TaxUnitList key={taxUnit.id} taxUnits={[taxUnit]} />
              ))}
          </div>
          <div className={styles.mobileList}>
            <TaxUnitMobileList
              taxUnits={data.filter((taxUnit: TaxUnit) => taxUnit.archived === null)}
            />
          </div>
        </>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}
      <div className={styles.buttonContainer}>
        <EffektButton onClick={() => setCreateModalOpen(true)}>Opprett ny skatteenhet</EffektButton>
      </div>

      {createModalOpen && (
        <TaxUnitCreateModal
          open={createModalOpen}
          onSuccess={(unit: TaxUnit) => {
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

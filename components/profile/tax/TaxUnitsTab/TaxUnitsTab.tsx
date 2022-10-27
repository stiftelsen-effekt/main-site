import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { TaxUnit } from "../../../../models";
import { useTaxUnits } from "../../../../_queries";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { ActivityContext } from "../../layout/activityProvider";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import { TaxUnitSelector } from "../../shared/TaxUnitSelector/TaxUnitSelector";
import styles from "./TaxUnitsTab.module.scss";

export const TaxUnitsTab: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { setActivity } = useContext(ActivityContext);

  if (!user) {
    return null;
  }

  const { loading, isValidating, data, error } = useTaxUnits(user, getAccessTokenSilently);

  const [selectedTaxUnit, setSelectedTaxUnit] = useState<TaxUnit | null>(data?.[0] ?? null);

  if (isValidating || loading) setActivity(true);
  else setActivity(false);

  return (
    <div className={styles.container}>
      <h5>Dine skatteenheter</h5>
      {!loading && !error && data && data.length > 0 ? (
        data.map((taxUnit: TaxUnit) => <TaxUnitList taxUnits={[taxUnit]} />)
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}
      <TaxUnitSelector
        selected={selectedTaxUnit}
        onChange={(selected: TaxUnit) => {
          alert(selected.id);
        }}
        onAddNew={() => {
          alert("Add new");
        }}
      />
    </div>
  );
};

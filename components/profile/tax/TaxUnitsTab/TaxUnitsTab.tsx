import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { TaxUnit } from "../../../../models";
import { useTaxUnits } from "../../../../_queries";
import { ActivityContext } from "../../layout/activityProvider";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import styles from "./TaxUnitsTab.module.scss";

export const TaxUnitsTab: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { setActivity } = useContext(ActivityContext);

  if (!user) {
    return null;
  }

  const { loading, isValidating, data, error } = useTaxUnits(user, getAccessTokenSilently);

  if (isValidating || loading) setActivity(true);
  else setActivity(false);

  return (
    <div className={styles.container}>
      <h5>Dine skatteenheter</h5>
      {!loading && !error && data && data.length > 0
        ? data.map((taxUnit: TaxUnit) => <TaxUnitList taxUnits={[taxUnit]} />)
        : null}
    </div>
  );
};

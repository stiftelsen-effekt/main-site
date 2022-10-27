import { useAuth0 } from "@auth0/auth0-react";
import { useRef, useState } from "react";
import { ChevronDown } from "react-feather";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import { TaxUnit } from "../../../../models";
import { useTaxUnits } from "../../../../_queries";

import styles from "./TaxUnitSelector.module.scss";

export const TaxUnitSelector: React.FC<{
  selected: TaxUnit | null;
  exclude?: TaxUnit[];
  onChange: (selectedTaxUnit: TaxUnit) => void;
  onAddNew: () => void;
}> = ({ selected, exclude = [], onChange, onAddNew }) => {
  const { getAccessTokenSilently, user } = useAuth0();

  if (!user) {
    return null;
  }

  const [menuOpen, setMenuOpen] = useState(false);

  const actionRef = useRef<HTMLDivElement>(null);
  useClickOutsideAlerter(actionRef, () => setMenuOpen(false));

  const { data, loading, isValidating, error } = useTaxUnits(user, getAccessTokenSilently);

  return (
    <div className={styles.container} ref={actionRef}>
      <button onClick={() => setMenuOpen(!menuOpen)} className={styles.button}>
        <div className={styles.left}>
          <div className={styles.name}>{selected ? selected.name : "Velg skatteenhet"}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.ssn}>{selected ? selected.ssn : ""}</div>
          <div className={styles.arrow}>
            <ChevronDown size={"1.2rem"}></ChevronDown>
          </div>
        </div>
      </button>
      {menuOpen && (
        <div className={styles.menu}>
          {loading && <div>Laster...</div>}
          {error && <div>En feil oppstod</div>}
          {data &&
            data
              .filter((taxUnit: TaxUnit) => taxUnit.archived === null)
              .filter((taxUnit: TaxUnit) => !exclude.map((u) => u.id).includes(taxUnit.id))
              .map((taxUnit: TaxUnit) => (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onChange(taxUnit);
                  }}
                  className={styles.menuItem}
                >
                  <div className={styles.inner}>
                    <div className={styles.name}>{taxUnit.name}</div>
                    <div className={styles.ssn}>{taxUnit.ssn}</div>
                  </div>
                </button>
              ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              onAddNew();
            }}
            className={styles.menuItem}
          >
            <div className={styles.inner}>
              <div className={styles.name}>Legg til ny enhet</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

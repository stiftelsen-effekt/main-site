import { useEffect, useState } from "react";
import { API_URL } from "../../../shared/components/Widget/config/api";
import { thousandize } from "../../../../util/formatting";
import styles from "./FundraiserVippsNumberDisplay.module.scss";

export const FundraiserVippsNumberDisplay: React.FC<{
  fundraiserId: string;
  vippsNumber: string;
}> = ({ vippsNumber, fundraiserId }) => {
  const [sum, setSum] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/fundraisers/${fundraiserId}/vippsnumber`)
      .then((res) => res.json())
      .then((data) => {
        setSum(data.content);
      });
  }, [fundraiserId]);

  if (!sum) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sum}>
        {`+ ${thousandize(sum)} kr direkte til vippsnummer `}
        <span className={styles.number}>#{vippsNumber}</span>
      </div>
      <div className={styles.context}>Oppdateres typisk én gang i døgnet</div>
    </div>
  );
};

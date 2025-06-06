import styles from "./DKMemberShipDisplay.module.scss";
import { Dkmembershipdisplay } from "../../../../studio/sanity.types";
import { useEffect, useState } from "react";
import { PortableText } from "next-sanity";
import { customComponentRenderers } from "../Paragraph/Citation";

export const DKMembershipDisplay: React.FC<
  Pick<Dkmembershipdisplay, "membership_count_subtitle" | "description">
> = ({ membership_count_subtitle, description }) => {
  const [memberships, setMemeberships] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      `/api/proxy?targetUrl=${encodeURIComponent("https://donation-platform.vercel.app/api/kpi")}`,
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data: ApiResponse) => {
            setMemeberships(data.kpi.members_confirmed + data.kpi.members_pending_renewal);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.count}>
        <span className={`${styles.number} ${memberships === null ? styles.loading : ""}`}>
          {memberships ? (
            Intl.NumberFormat("dk-DK").format(memberships)
          ) : (
            <div className={styles.shimmer} />
          )}
        </span>
        <span className={styles.subtitle}>{membership_count_subtitle}</span>
      </div>
      <div className={styles.description}>
        <PortableText
          value={description as any}
          components={customComponentRenderers}
        ></PortableText>
      </div>
    </div>
  );
};

interface Kpi {
  dkk_total: number;
  dkk_total_ops: number;
  dkk_pending_transfer: number;
  dkk_last_30_days: number;
  dkk_recurring_next_year: number;
  members_confirmed: number;
  members_pending_renewal: number;
  monthly_donors: string; // Represented as string in JSON
  number_of_donors: number;
  is_max_tax_deduction_known: number; // Could be boolean if 0 or 1 are the only options
  oldest_stopped_donation_age: number;
  missing_gavebrev_income_proof: string; // Represented as string in JSON
  pending_skat_update: string; // Represented as string in JSON
}

interface ApiResponse {
  // There are more fields in the response, but we only need the kpi field for now
  kpi: Kpi;
}

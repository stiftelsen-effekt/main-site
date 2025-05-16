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

interface PendingOrTransferredItem {
  recipient: string;
  dkk_total: number;
  payments_total: number;
}

interface TransferOverviewItem {
  id: string;
  earmark: string;
  recipient: string;
  unit: string;
  total_dkk: number;
  total_usd: number;
  unit_cost_external: number;
  unit_cost_conversion: number;
  unit_cost_dkk: number;
  unit_impact: number;
  life_cost_external: number | null;
  life_cost_dkk: number | null;
  life_impact: number | null;
  computed_at: string; // ISO date string
  transferred_at: string; // Date string (YYYY-MM-DD) or "Næste overførsel"
}

interface CollectedItem {
  date: string; // YYYY-MM-DD
  amount_once_small: number;
  amount_once_medium: number;
  amount_once_large: number;
  amount_once_major: number;
  amount_monthly_small: number;
  amount_monthly_medium: number;
  amount_monthly_large: number;
  amount_monthly_major: number;
  payments_once_small: number;
  payments_once_medium: number;
  payments_once_large: number;
  payments_once_major: number;
  payments_monthly_small: number;
  payments_monthly_medium: number;
  payments_monthly_large: number;
  payments_monthly_major: number;
  value_added_once_small: number;
  value_added_once_medium: number;
  value_added_once_large: number;
  value_added_once_major: number;
  value_added_monthly_small: number;
  value_added_monthly_medium: number;
  value_added_monthly_large: number;
  value_added_monthly_major: number;
  value_lost_small: number;
  value_lost_medium: number;
  value_lost_large: number;
  value_lost_major: number;
  value_total: number;
  monthly_donors: number;
  payments_total: number;
  dkk_total: number;
  value_added: number;
  value_added_once: number;
  value_added_monthly: number;
  value_lost: number;
  amount_new: number;
  payments_new: number;
}

interface ApiResponse {
  kpi: Kpi;
  pending: PendingOrTransferredItem[];
  transferred: PendingOrTransferredItem[];
  transfer_overview: TransferOverviewItem[];
  collected: CollectedItem[];
}

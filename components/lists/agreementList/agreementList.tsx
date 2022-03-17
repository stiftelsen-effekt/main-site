import { AvtaleGiroAgreement, Donation, VippsAgreement } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";

// type AgreementRow {

// }

export const AgreementList: React.FC<{
  // agreements: agreementrow[];
  agreements: (AvtaleGiroAgreement | VippsAgreement)[];
  title: string;
  supplemental: string;
}> = ({ agreements, title, supplemental }) => {
  const headers = ["Type", "Dato", "Sum", "KID"];

  const rows: ListRow[] = agreements.map((agreement) => ({
    id: agreement.ID.toString(),
    cells: [
      "TYPE",
      // agreement.type.toString(),
      "Den " +
        (
          (agreement as AvtaleGiroAgreement).payment_date ||
          (agreement as VippsAgreement).monthly_charge_day
        ).toString() +
        ". hver måned",
      thousandize(agreement.amount) + " kr",
      agreement.KID,
    ],
    details: <></>,
  }));

  return (
    <GenericList
      title={title}
      supplementalInformation={supplemental}
      headers={headers}
      rows={rows}
    />
  );
};

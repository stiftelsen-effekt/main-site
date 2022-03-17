import { AvtaleGiroAgreement, Donation, VippsAgreement } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";

type AgreementRow = {
  ID: number;
  status: boolean;
  KID: string;
  date: number; 
  amount: number;
  type: string
 }

export const AgreementList: React.FC<{
  agreements: AgreementRow[];
  // agreements: (AvtaleGiroAgreement | VippsAgreement)[];
  title: string;
  supplemental: string;
}> = ({ agreements, title, supplemental }) => {
  const headers = ["Type", "Dato", "Sum", "KID"];

  const rows: ListRow[] = agreements.map((agreement) => ({
    id: agreement.ID.toString(),
    cells: [
      agreement.type,
      "Den " +
        (
          // agreement.payment_date ||
          agreement.date
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

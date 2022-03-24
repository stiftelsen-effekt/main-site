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
  avtalegiro: AvtaleGiroAgreement[];
  vipps: VippsAgreement[];
  title: string;
  supplemental: string;
}> = ({ avtalegiro, vipps, title, supplemental }) => {
  const headers = ["Type", "Dato", "Sum", "KID"];

  let vippsType = vipps.map((entry) => ({
    ID: entry.ID,
    status: entry.status,
    KID: entry.KID,
    date: entry.monthly_charge_day,
    amount: entry.amount,
    type: "Vipps"
  }));

  let giroType = avtalegiro.map((entry) =>({
    ID: entry.ID,
    status: entry.active,
    KID: entry.KID,
    date: entry.payment_date,
    amount: entry.amount,
    type: "AvtaleGiro"
  })
  );

  let rowData: AgreementRow[] = [...vippsType, ...giroType]

  const rows: ListRow[] = rowData.map((agreement) => ({
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

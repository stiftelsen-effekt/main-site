import { AvtaleGiroAgreement, Distribution, Donation, VippsAgreement } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";
import { AgreementDetails } from "./agreementDetails";

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
  distributions: Map<string, Distribution>;
}> = ({ avtalegiro, vipps, title, supplemental, distributions }) => {
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
    details: <AgreementDetails inputDistribution={distributions.get(agreement.KID) as Distribution} inputSum={agreement.amount} inputDate={agreement.date} />,
  }));

  const emptyPlaceholder = <div>
    <div>Vi har ikke registrert noen aktive faste donasjonsavtaler på deg..</div>
    <div>Mangler det avtaler vi ikke har registrert? Ta kontakt på <a href={'mailto: donasjon@gieffektivt.no'}>donasjon@gieffektivt.no</a>.</div>
  </div>

  return (
    <GenericList
      emptyPlaceholder={emptyPlaceholder}
      title={title}
      supplementalInformation={supplemental}
      headers={headers}
      rows={rows}
    />
  );
};

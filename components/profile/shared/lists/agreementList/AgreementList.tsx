import { AvtaleGiroAgreement, Distribution, VippsAgreement } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { GenericList, ListRow } from "../GenericList";
import { AgreementDetails } from "./AgreementDetails";

type AgreementRow = {
  ID: number;
  status: string | boolean;
  KID: string;
  date: number;
  amount: number;
  type: "Vipps" | "AvtaleGiro";
  endpoint: string;
};

export const AgreementList: React.FC<{
  avtalegiro: AvtaleGiroAgreement[];
  vipps: VippsAgreement[];
  title: string;
  supplemental: string;
  emptyString: string;
  distributions: Map<string, Distribution>;
  expandable?: boolean;
}> = ({ avtalegiro, vipps, title, supplemental, emptyString, distributions, expandable }) => {
  const headers = ["Type", "Dato", "Sum", "KID"];

  let vippsType = vipps.map(
    (entry): AgreementRow => ({
      ID: entry.ID,
      status: entry.status,
      KID: entry.KID,
      date: entry.monthly_charge_day,
      amount: entry.amount,
      type: "Vipps",
      endpoint: entry.agreement_url_code,
    }),
  );

  let giroType = avtalegiro.map(
    (entry: AvtaleGiroAgreement): AgreementRow => ({
      ID: entry.ID,
      status: entry.active == 1,
      KID: entry.KID,
      date: entry.payment_date,
      amount: parseFloat(entry.amount),
      type: "AvtaleGiro",
      endpoint: entry.KID,
    }),
  );

  let rowData: AgreementRow[] = [...vippsType, ...giroType];

  /**
   * Maps agreements into rows in the agreement table.
   */
  const rows: ListRow[] = rowData.map((agreement) => ({
    id: agreement.ID.toString(),
    defaultExpanded: false,
    cells: [
      agreement.type,
      agreement.date > 0
        ? "Den " +
          agreement.date // agreement.payment_date ||
            .toString() +
          ". hver måned"
        : "Siste dagen i måneden",
      thousandize(agreement.amount) + " kr",
      agreement.KID,
    ],
    details: (
      <AgreementDetails
        type={agreement.type}
        endpoint={agreement.endpoint}
        inputDistribution={distributions.get(agreement.KID) as Distribution}
        inputSum={agreement.amount}
        inputDate={agreement.date}
      />
    ),
  }));

  const emptyPlaceholder = (
    <div data-cy="agreement-list-empty-placeholder">
      <div>{emptyString}</div>
      <div>
        Mangler det avtaler vi ikke har registrert? Ta kontakt på{" "}
        <a href={"mailto: donasjon@gieffektivt.no"}>donasjon@gieffektivt.no</a>.
      </div>
    </div>
  );

  return (
    <GenericList
      emptyPlaceholder={emptyPlaceholder}
      title={title}
      supplementalInformation={supplemental}
      headers={headers}
      rows={rows}
      expandable={expandable}
    />
  );
};

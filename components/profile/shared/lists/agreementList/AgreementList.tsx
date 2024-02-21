import { PortableText } from "@portabletext/react";
import {
  AutoGiroAgreement,
  AvtaleGiroAgreement,
  Distribution,
  TaxUnit,
  VippsAgreement,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { AgreementDetails, AgreementDetailsConfiguration } from "./AgreementDetails";

type AgreementRow = {
  ID: number;
  status: string | boolean;
  KID: string;
  date: number;
  amount: number;
  type: "Vipps" | "AvtaleGiro" | "AutoGiro";
  endpoint: string;
};

type AgreementListConfigurationColumn = {
  title: string;
  value: keyof AgreementRow;
  type: "string" | "sum" | "date" | "paymentmethod";
  width?: string;
  payment_date_format_template?: string;
  payment_date_last_day_of_month_template?: string;
};

type AgreementListConfiguration = {
  title: string;
  subtitle_text: string;
  list_empty_content: any[];
  columns: AgreementListConfigurationColumn[];
  details_configuration: AgreementDetailsConfiguration;
};

export const AgreementList: React.FC<{
  avtalegiro: AvtaleGiroAgreement[];
  vipps: VippsAgreement[];
  autogiro: AutoGiroAgreement[];
  distributions: Map<string, Distribution>;
  taxUnits: TaxUnit[];
  expandable?: boolean;
  configuration: AgreementListConfiguration;
}> = ({ avtalegiro, vipps, autogiro, distributions, taxUnits, expandable, configuration }) => {
  const headers = configuration.columns.map((column) => ({
    label: column.title,
    width: column.width,
  }));

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

  let autoGiroType = autogiro.map(
    (entry: AutoGiroAgreement): AgreementRow => ({
      ID: entry.ID,
      status: entry.active,
      KID: entry.KID,
      date: entry.payment_date,
      amount: parseFloat(entry.amount),
      type: "AutoGiro",
      endpoint: entry.KID,
    }),
  );

  let rowData: AgreementRow[] = [...vippsType, ...giroType, ...autoGiroType];

  /**
   * Maps agreements into rows in the agreement table.
   */
  const rows: ListRow<AgreementRow>[] = rowData.map((agreement) => ({
    id: agreement.ID.toString(),
    defaultExpanded: false,
    cells: configuration.columns.map((column) => ({
      value: formatColumnValue(column, agreement[column.value]),
    })),
    details: (
      <AgreementDetails
        type={agreement.type}
        endpoint={agreement.endpoint}
        inputDistribution={distributions.get(agreement.KID) as Distribution}
        taxUnits={taxUnits}
        inputSum={agreement.amount}
        inputDate={agreement.date}
        configuration={configuration.details_configuration}
      />
    ),
    element: agreement,
  }));

  const emptyPlaceholder = (
    <div data-cy="agreement-list-empty-placeholder">
      <PortableText value={configuration.list_empty_content} />
    </div>
  );

  return (
    <GenericList
      emptyPlaceholder={emptyPlaceholder}
      title={configuration.title}
      supplementalInformation={configuration.subtitle_text}
      headers={headers}
      rows={rows}
      expandable={expandable}
      proportions={[20, 70]}
    />
  );
};

const formatColumnValue = (column: AgreementListConfigurationColumn, value: any) => {
  switch (column.type) {
    case "string":
      return value;
    case "sum":
      return thousandize(Math.round(parseFloat(value))) + " kr";
    case "date":
      return value === 0
        ? column.payment_date_last_day_of_month_template
        : column.payment_date_format_template?.replaceAll("{{date}}", value);
    case "paymentmethod":
      return value;
  }
};

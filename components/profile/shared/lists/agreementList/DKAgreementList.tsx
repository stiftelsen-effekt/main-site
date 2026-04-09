import { PortableText } from "@portabletext/react";
import { DKAgreement, DKPaymentMethod, Distribution, TaxUnit } from "../../../../../models";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { thousandize } from "../../../../../util/formatting";
import { AgreementDetailsConfiguration } from "./AgreementDetails";
import { DKAgreementDetails } from "./DKAgreementDetails";
import { distributionTargetsMembershipFee } from "./dkMembershipDisplay";

const PAYMENT_METHOD_LABELS: Record<DKPaymentMethod, string> = {
  MobilePay: "MobilePay",
  "Credit card": "Kort",
  "Bank transfer": "Bank",
};

type DKAgreementRow = {
  id: string;
  status: string;
  KID: string;
  date: number;
  amount: number;
  type: DKPaymentMethod;
};
type DKAgreementListConfigurationColumn = {
  title: string;
  value: keyof DKAgreementRow;
  type: "string" | "sum" | "date" | "paymentmethod";
  width?: string;
  payment_date_format_template?: string;
  payment_date_last_day_of_month_template?: string;
  payment_date_membership_format_template?: string;
  hide_on_mobile?: boolean;
};

type DKAgreementListConfiguration = {
  title: string;
  subtitle_text: string;
  list_empty_content: any[];
  columns: DKAgreementListConfigurationColumn[];
  details_configuration?: AgreementDetailsConfiguration;
};

export const DKAgreementList: React.FC<{
  agreements: DKAgreement[];
  distributions?: Map<string, Distribution>;
  taxUnits?: TaxUnit[];
  expandable?: boolean;
  configuration: DKAgreementListConfiguration;
}> = ({ agreements, distributions, taxUnits, expandable, configuration }) => {
  const columns = configuration.columns.filter(
    (column) => window && !(window.innerWidth < 1180 && column.hide_on_mobile),
  );

  const headers = columns.map((column) => ({
    label: column.title,
    width: column.width,
  }));

  const rows: ListRow<DKAgreementRow>[] = agreements.map((dkAgreement) => {
    const row: DKAgreementRow = {
      id: dkAgreement.id,
      status: dkAgreement.cancelled ? "STOPPED" : "ACTIVE",
      KID: dkAgreement.bank_msg ?? dkAgreement.kid,
      date: dkAgreement.chargeDay ?? 0,
      amount: dkAgreement.amount,
      type: dkAgreement.method,
    };

    const rowDistribution = distributions?.get(dkAgreement.kid);

    return {
      id: row.id,
      defaultExpanded: false,
      cells: columns.map((column) => ({
        value: formatColumnValue(column, row[column.value], row.type, rowDistribution),
      })),
      details:
        expandable && configuration.details_configuration && taxUnits ? (
          <DKAgreementDetails
            agreement={dkAgreement}
            agreementId={dkAgreement.id}
            method={dkAgreement.method}
            inputDistribution={distributions?.get(dkAgreement.kid)}
            taxUnits={taxUnits}
            inputSum={row.amount}
            inputDate={row.date}
            configuration={configuration.details_configuration}
          />
        ) : undefined,
      element: row,
    };
  });

  const emptyPlaceholder = (
    <div data-cy="dk-agreement-list-empty-placeholder">
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

const formatColumnValue = (
  column: DKAgreementListConfigurationColumn,
  value: any,
  method: DKPaymentMethod,
  distribution?: Distribution,
) => {
  switch (column.type) {
    case "string":
      return value;
    case "sum":
      return thousandize(Math.round(parseFloat(value))) + " kr";
    case "date":
      if (method === "Bank transfer") {
        return "Du bestemmer selv";
      }
      if (value === 0) {
        return column.payment_date_last_day_of_month_template;
      }
      const membershipTemplate = column.payment_date_membership_format_template?.trim();
      const useMembershipTemplate =
        distribution && distributionTargetsMembershipFee(distribution) && membershipTemplate;
      const template = useMembershipTemplate
        ? membershipTemplate
        : column.payment_date_format_template;
      return template?.replaceAll("{{date}}", String(value));
    case "paymentmethod":
      return PAYMENT_METHOD_LABELS[value as DKPaymentMethod] || value;
  }
};

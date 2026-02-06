import { PortableText } from "@portabletext/react";
import { DKAgreement, DKPaymentMethod } from "../../../../../models";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { thousandize } from "../../../../../util/formatting";

const PAYMENT_METHOD_LABELS: Record<DKPaymentMethod, string> = {
  MobilePay: "MobilePay",
  "Credit card": "Kort",
  "Bank transfer": "Bank",
};

type DKAgreementRow = {
  id: string;
  status: string;
  date: number;
  amount: number;
  method: DKPaymentMethod;
};

type DKAgreementListConfigurationColumn = {
  title: string;
  value: keyof DKAgreementRow;
  type: "string" | "sum" | "date" | "paymentmethod";
  width?: string;
  payment_date_format_template?: string;
  payment_date_last_day_of_month_template?: string;
  hide_on_mobile?: boolean;
};

type DKAgreementListConfiguration = {
  title: string;
  subtitle_text: string;
  list_empty_content: any[];
  columns: DKAgreementListConfigurationColumn[];
};

export const DKAgreementList: React.FC<{
  agreements: DKAgreement[];
  expandable?: boolean;
  configuration: DKAgreementListConfiguration;
}> = ({ agreements, expandable, configuration }) => {
  const columns = configuration.columns.filter(
    (column) => window && !(window.innerWidth < 1180 && column.hide_on_mobile),
  );

  const headers = columns.map((column) => ({
    label: column.title,
    width: column.width,
  }));

  const rowData: DKAgreementRow[] = agreements.map((agreement) => ({
    id: agreement.id,
    status: agreement.cancelled ? "STOPPED" : "ACTIVE",
    date: agreement.chargeDay ?? 0,
    amount: agreement.amount,
    method: agreement.method,
  }));

  const rows: ListRow<DKAgreementRow>[] = rowData.map((agreement) => ({
    id: agreement.id,
    defaultExpanded: false,
    cells: columns.map((column) => ({
      value: formatColumnValue(column, agreement[column.value], agreement.method),
    })),
    element: agreement,
  }));

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
      return value === 0
        ? column.payment_date_last_day_of_month_template
        : column.payment_date_format_template?.replaceAll("{{date}}", value);
    case "paymentmethod":
      return PAYMENT_METHOD_LABELS[value as DKPaymentMethod] || value;
  }
};

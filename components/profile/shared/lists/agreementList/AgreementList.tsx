import { PortableText } from "@portabletext/react";
import {
  AutoGiroAgreement,
  AvtaleGiroAgreement,
  Distribution,
  TaxUnit,
  VippsAgreement,
} from "../../../../../models";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { AgreementDetails, AgreementDetailsConfiguration } from "./AgreementDetails";
import { useState } from "react";
import { StoppedAgreementFeedback } from "../../../agreements/StoppedAgreementFeedback/StoppedAgreementFeedback";
import { Lightbox } from "../../../../shared/components/Lightbox/Lightbox";
import { thousandize } from "../../../../../util/formatting";

type NordicAgreementTypes = "Vipps" | "AvtaleGiro" | "AutoGiro";
type DKAgreementTypes = "MobilePay" | "Credit card" | "Bank transfer";

export type AgreementTypes = NordicAgreementTypes | DKAgreementTypes;

const DK_PAYMENT_METHOD_LABELS: Record<DKAgreementTypes, string> = {
  MobilePay: "MobilePay",
  "Credit card": "Kort",
  "Bank transfer": "Bank",
};

type AgreementRow = {
  ID: number;
  status: string | boolean;
  KID: string;
  date: number;
  amount: number;
  type: AgreementTypes;
  endpoint: string;
};

type AgreementListConfigurationColumn = {
  title: string;
  value: keyof AgreementRow;
  type: "string" | "sum" | "date" | "paymentmethod";
  width?: string;
  payment_date_format_template?: string;
  payment_date_last_day_of_month_template?: string;
  hide_on_mobile?: boolean;
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
  const [agreementCancelled, setAgreementCancelled] = useState<{
    agreementType: AgreementTypes;
    agreementId: string;
    agreementKid: string;
  } | null>(null);

  const columns = configuration.columns.filter(
    (column) => window && !(window.innerWidth < 1180 && column.hide_on_mobile),
  );

  const headers = columns.map((column) => ({
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
      type: entry.method || "Vipps",
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
    cells: columns.map((column) => ({
      value: formatColumnValue(column, agreement[column.value], agreement.type),
    })),
    details: (
      <AgreementDetails
        type={agreement.type}
        agreementKid={agreement.KID}
        endpoint={agreement.endpoint}
        agreementId={agreement.ID.toString()}
        inputDistribution={distributions.get(agreement.KID) as Distribution}
        taxUnits={taxUnits}
        inputSum={agreement.amount}
        inputDate={agreement.date}
        configuration={configuration.details_configuration}
        agreementCancelled={(
          agreementType: AgreementTypes,
          agreementId: string,
          agreementKid: string,
        ) =>
          setAgreementCancelled({
            agreementType: agreementType,
            agreementId: agreementId,
            agreementKid: agreementKid,
          })
        }
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
    <>
      <GenericList
        emptyPlaceholder={emptyPlaceholder}
        title={configuration.title}
        supplementalInformation={configuration.subtitle_text}
        headers={headers}
        rows={rows}
        expandable={expandable}
        proportions={[20, 70]}
      />
      {configuration.details_configuration &&
        configuration.details_configuration.agreement_cancelled_lightbox && (
          <Lightbox
            open={!!agreementCancelled}
            onConfirm={() => setAgreementCancelled(null)}
            confirmLabel={
              configuration.details_configuration.agreement_cancelled_lightbox.lightbox_button_text
            }
          >
            {agreementCancelled && (
              <StoppedAgreementFeedback
                title={configuration.details_configuration.agreement_cancelled_lightbox.title}
                text={configuration.details_configuration.agreement_cancelled_lightbox.text}
                agreementType={agreementCancelled.agreementType}
                agreementId={agreementCancelled.agreementId}
                KID={agreementCancelled.agreementKid}
              />
            )}
          </Lightbox>
        )}
    </>
  );
};

const formatColumnValue = (
  column: AgreementListConfigurationColumn,
  value: any,
  agreementType?: AgreementTypes,
) => {
  switch (column.type) {
    case "string":
      return value;
    case "sum":
      return thousandize(Math.round(parseFloat(value))) + " kr";
    case "date":
      // Bank transfer agreements don't have a fixed charge day
      if (agreementType === "Bank transfer") {
        return "Du bestemmer selv";
      }
      return value === 0
        ? column.payment_date_last_day_of_month_template
        : column.payment_date_format_template?.replaceAll("{{date}}", value);
    case "paymentmethod":
      if (value in DK_PAYMENT_METHOD_LABELS) {
        return DK_PAYMENT_METHOD_LABELS[value as DKAgreementTypes];
      }
      return value;
  }
};

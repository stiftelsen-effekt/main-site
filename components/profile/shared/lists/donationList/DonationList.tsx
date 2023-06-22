import { PortableText } from "@portabletext/react";
import { Distribution, Donation } from "../../../../../models";
import { onlyDate, thousandize } from "../../../../../util/formatting";
import { ErrorMessage } from "../../ErrorMessage/ErrorMessage";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { DonationDetails, DonationDetailsConfiguration } from "./DonationDetails";

export type TableFieldTypes = "string" | "sum" | "date" | "paymentmethod";

export type DonationsListConfiguration = {
  columns: {
    title: string;
    value: keyof Donation;
    type: TableFieldTypes;
    width?: string;
  }[];
  tax_deduction_current_year_template: string;
  tax_deduction_previous_year_template: string;
  no_donations_placeholder_text: any[];
};

export const DonationList: React.FC<{
  donations: Donation[];
  distributions: Map<string, Distribution>;
  year: string;
  configuration: DonationsListConfiguration;
  detailsConfiguration?: DonationDetailsConfiguration;
  firstOpen: boolean;
}> = ({ donations, distributions, year, configuration, detailsConfiguration, firstOpen }) => {
  let taxDeductionText: JSX.Element | undefined = undefined;

  let taxDeductions = 0;
  let processedUnits = new Set<number>();
  distributions.forEach((el) => {
    // Get all unique tax units by id
    if (typeof el.taxUnit !== "undefined") {
      if (el.taxUnit?.archived == null && typeof el.taxUnit?.taxDeductions !== "undefined") {
        if (!processedUnits.has(el.taxUnit.id)) {
          el.taxUnit?.taxDeductions.forEach((deduction) => {
            if (deduction.year === parseInt(year)) {
              taxDeductions += deduction.taxDeduction;
            }
          });
          processedUnits.add(el.taxUnit.id);
        }
      }
    }
  });
  if (taxDeductions > 0) {
    {
      /** TODO: Tax rules will differ for different juristictions. Update backend to support a structured format to reflect this. */
    }
    let taxDeductionTextSplit: string[];
    let taxDeductionSumElement: JSX.Element = (
      <span style={{ whiteSpace: "nowrap" }}>{thousandize(Math.round(taxDeductions * 0.22))}</span>
    );

    if (year === new Date().getFullYear().toString()) {
      taxDeductionTextSplit =
        configuration.tax_deduction_current_year_template.split("{{deduction}}");
    } else {
      taxDeductionTextSplit =
        configuration.tax_deduction_previous_year_template.split("{{deduction}}");
    }

    taxDeductionTextSplit = taxDeductionTextSplit.map((el) => el.replace("{{year}}", year));

    taxDeductionText = (
      <span>
        {taxDeductionTextSplit[0]}
        {taxDeductionSumElement}
        {taxDeductionTextSplit[1]}
      </span>
    );
  }

  const headers = configuration.columns.map((column) => {
    return {
      label: column.title,
      width: column.width + "%",
    };
  });

  const rows: ListRow<Donation>[] = donations.map((donation, index) => {
    return {
      id: donation.id.toString(),
      defaultExpanded: firstOpen && index === 0 ? true : false,
      cells: configuration.columns.map((column) => ({
        value: formatField(donation[column.value], column.type),
      })),
      details: detailsConfiguration ? (
        <DonationDetails
          key={donation.id}
          donation={donation}
          sum={donation.sum}
          distribution={distributions.get(donation.KID.trim()) as Distribution}
          timestamp={new Date(donation.timestamp)}
          configuration={detailsConfiguration}
        />
      ) : (
        <ErrorMessage>Missing donation details configuration in Sanity</ErrorMessage>
      ),
      element: donation,
    };
  });

  const emptyPlaceholder = (
    <div>
      <PortableText value={configuration.no_donations_placeholder_text} />
    </div>
  );

  return (
    <GenericList
      title={year}
      supplementalInformation={taxDeductionText}
      headers={headers}
      rows={rows}
      emptyPlaceholder={emptyPlaceholder}
      expandable={true}
      proportions={[20, 70]}
    />
  );
};

const formatField: (field: any, type: TableFieldTypes) => string = (field, type) => {
  switch (type) {
    case "string":
      return field;
    case "sum":
      return thousandize(Math.round(parseFloat(field))) + " kr";
    case "date":
      return onlyDate(field);
    case "paymentmethod":
      return mapPaymentMethodString(field);
    default:
      return field;
  }
};

const mapPaymentMethodString = (paymentMethod: string): string => {
  switch (paymentMethod) {
    case "Vipps Recurring":
      return "Vippsavtale";
    case "Vipps KID":
      return "Vipps";
    case "Bank u/KID":
      return "Bank";
    default:
      return paymentMethod;
  }
};

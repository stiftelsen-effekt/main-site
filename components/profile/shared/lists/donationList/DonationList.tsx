import { Distribution, Donation } from "../../../../../models";
import { onlyDate, thousandize } from "../../../../../util/formatting";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { DonationDetails } from "./DonationDetails";

export type TableFieldTypes = "string" | "sum" | "date" | "paymentmethod";

export type DonationsListConfiguration = {
  columns: {
    title: string;
    value: keyof Donation;
    type: TableFieldTypes;
    width?: string;
  }[];
};

export const DonationList: React.FC<{
  donations: Donation[];
  distributions: Map<string, Distribution>;
  year: string;
  configuration: DonationsListConfiguration;
  firstOpen: boolean;
}> = ({ donations, distributions, year, configuration, firstOpen }) => {
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
    taxDeductionText = (
      <span>
        {`I ${year} ${
          year === new Date().getFullYear().toString()
            ? "får du skattefradrag som kvalifiserer deg for"
            : "fikk du skattefradrag som kvalifiserte deg for"
        }`}{" "}
        <span style={{ whiteSpace: "nowrap" }}>
          {thousandize(Math.round(taxDeductions * 0.22))}
        </span>{" "}
        kroner mindre i skatt
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
      details: (
        <DonationDetails
          key={donation.id}
          donation={donation}
          sum={donation.sum}
          distribution={distributions.get(donation.KID.trim()) as Distribution}
          timestamp={new Date(donation.timestamp)}
        />
      ),
      element: donation,
    };
  });

  const emptyPlaceholder = (
    <div>
      <div>Vi har ikke registrert noen donasjoner fra deg i {year}.</div>
      <div>
        Mangler det donasjoner vi ikke har registrert? Ta kontakt på{" "}
        <a href={"mailto: donasjon@gieffektivt.no"}>donasjon@gieffektivt.no</a>.
      </div>
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

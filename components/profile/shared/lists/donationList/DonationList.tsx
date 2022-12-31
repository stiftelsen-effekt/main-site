import { Distribution, Donation, META_OWNER } from "../../../../../models";
import { onlyDate, shortDate, thousandize } from "../../../../../util/formatting";
import { GenericList, ListRow } from "../GenericList";
import { DonationDetails } from "./DonationDetails";

export const DonationList: React.FC<{
  donations: Donation[];
  distributions: Map<string, Distribution>;
  year: string;
  firstOpen: boolean;
}> = ({ donations, distributions, year, firstOpen }) => {
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
        {`Dine donasjoner i ${year} ${
          year === new Date().getFullYear().toString() ? "kvalifiserer deg for" : "ga deg"
        }`}{" "}
        <span style={{ whiteSpace: "nowrap" }}>{thousandize(Math.round(taxDeductions))}</span>{" "}
        kroner i skattefradrag
      </span>
    );
  }

  const headers = [
    {
      label: "Dato",
      width: "25%",
    },
    {
      label: "Sum",
      width: "25%",
    },
    {
      label: "Betalingskanal",
      width: "25%",
    },
    {
      label: "KID",
    },
  ];

  const rows: ListRow<Donation>[] = donations.map((donation, index) => {
    return {
      id: donation.id.toString(),
      defaultExpanded: firstOpen && index === 0 ? true : false,
      cells: [
        onlyDate(donation.timestamp),
        thousandize(Math.round(parseFloat(donation.sum))) + " kr",
        mapPaymentMethodString(donation.paymentMethod),
        donation.KID,
      ],
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
    />
  );
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

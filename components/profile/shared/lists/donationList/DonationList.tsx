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
  let taxEligableSum = donations
    .filter((d) => d.metaOwnerId === META_OWNER.EAN || d.metaOwnerId === META_OWNER.EFFEKTANDEAN)
    .reduce((acc, curr) => acc + parseFloat(curr.sum), 0);

  let taxDeductionText: JSX.Element | undefined = undefined;

  let taxDeductions = 0;
  distributions.forEach((el) => {
    console.log(el);
    if (typeof el.taxUnit !== "undefined") {
      if (el.taxUnit?.archived == null && typeof el.taxUnit?.taxDeductions !== "undefined") {
        el.taxUnit?.taxDeductions.forEach((deduction) => {
          if (deduction.year === parseInt(year)) {
            taxDeductions += deduction.taxDeduction;
          }
        });
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
          distribution={distributions.get(donation.KID) as Distribution}
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

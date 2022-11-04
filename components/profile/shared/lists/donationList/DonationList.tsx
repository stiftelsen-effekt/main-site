import { Distribution, Donation, META_OWNER } from "../../../../../models";
import { shortDate, thousandize } from "../../../../../util/formatting";
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

  taxEligableSum = Math.min(taxEligableSum, year === "2022" ? 25000 : 50000);

  let taxDeductionText: JSX.Element | undefined = undefined;

  if (taxEligableSum > 500 && parseInt(year) >= 2019) {
    const taxDeductions = Math.round(taxEligableSum * 0.22);
    taxDeductionText = (
      <span>
        {`Dine donasjoner i ${year} ${
          year === new Date().getFullYear().toString() ? "kvalifiserer deg for" : "ga deg"
        }`}{" "}
        <span style={{ whiteSpace: "nowrap" }}>{thousandize(taxDeductions)}</span> kroner i
        skattefradrag
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
        shortDate(donation.timestamp),
        thousandize(Math.round(parseFloat(donation.sum))) + " kr",
        donation.paymentMethod,
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

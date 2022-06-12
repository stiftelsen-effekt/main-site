import { Distribution, Donation, META_OWNER } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";
import { DonationDetails } from "./donationDetails";

export const DonationList: React.FC<{
  donations: Donation[];
  distributions: Map<string, Distribution>;
  year: string;
}> = ({ donations, distributions, year }) => {
  let taxEligableSum = donations
    .filter((d) => d.metaOwnerId === META_OWNER.EAN || d.metaOwnerId === META_OWNER.EFFEKTANDEAN)
    .reduce((acc, curr) => acc + parseFloat(curr.sum), 0);

  taxEligableSum = Math.min(taxEligableSum, year === "2022" ? 25000 : 50000);

  let taxDeductionText = "";

  if (taxEligableSum > 500 && parseInt(year) >= 2019) {
    const taxDeductions = Math.round(taxEligableSum * 0.22);
    taxDeductionText = `Dine donasjoner i ${year} ${
      year === "2022" ? "kvalifiserer deg for" : "ga deg"
    } ${thousandize(taxDeductions)} kroner i
    skattefradrag`;
  }

  const headers = ["Dato", "Sum", "Betalingskanal", "KID"];

  const rows: ListRow[] = donations.map((donation) => {
    return {
      id: donation.id.toString(),
      cells: [
        shortDate(donation.timestamp),
        thousandize(Math.round(parseFloat(donation.sum))) + "kr",
        donation.paymentMethod,
        donation.KID,
      ],
      details: (
        <DonationDetails
          key={donation.id}
          sum={donation.sum}
          distribution={distributions.get(donation.KID) as Distribution}
        />
      ),
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
    />
  );
};

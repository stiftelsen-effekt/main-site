import { Distribution, Donation } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";
import { DonationDetails } from "./donationDetails";

export const DonationList: React.FC<{
  donations: Donation[];
  distributions: Map<string, Distribution>;
  year: string;
}> = ({ donations, distributions, year }) => {
  let taxDeductions = donations.reduce((acc, curr) => acc + parseFloat(curr.sum), 0);

  taxDeductions = Math.min(taxDeductions, 50000);

  const taxDeductionText = `Dine donasjoner i ${year} kvalifiserte deg for ${thousandize(
    taxDeductions,
  )} kroner i
  skattefradrag`;
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
      supplementalInformation={donations.length > 0 ? taxDeductionText : ""}
      headers={headers}
      rows={rows}
      emptyPlaceholder={emptyPlaceholder}
    />
  );
};

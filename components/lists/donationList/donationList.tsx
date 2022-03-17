import { Donation } from "../../../models";
import { shortDate, thousandize } from "../../../util/formatting";
import { GenericList, ListRow } from "../genericList";

export const DonationList: React.FC<{ donations: Donation[], year: string }> = ({ donations, year }) => {
  let taxDeductions = donations
    .reduce((acc, curr) => acc + parseFloat(curr.sum),0)

  taxDeductions = Math.min(taxDeductions, 50000)

  const taxDeductionText = `Dine donasjoner i ${year} kvalifiserte deg for ${thousandize(taxDeductions)} kroner i
  skattefradrag`;
  const headers = ["Dato", "Sum", "Betalingskanal", "KID"];

  const rows: ListRow[] = donations.map(donation => ({
    id: donation.id.toString(),
    cells: [shortDate(donation.timestamp), 
      thousandize(Math.round(parseFloat(donation.sum))) + "kr",
      donation.paymentMethod,
      donation.KID],
    details: <></>
  }))

  return (
    <GenericList title={year}
      supplementalInformation={taxDeductionText}
      headers={headers}
      rows={rows} />
  );
}
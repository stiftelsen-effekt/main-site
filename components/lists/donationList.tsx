import style from "../../styles/Lists.module.css";
import { Donation } from "../../models";
import DonationListRow from "./donationListRow";
import { thousandize } from "../../util/formatting";

export const DonationList: React.FC<{ donations: Donation[] }> = ({ donations }) => {
  const yearSet = new Set<number>()
  donations.forEach(el => yearSet.add(new Date(el.timestamp).getFullYear()))
  const years = Array.from(yearSet).sort((a,b) => b - a)

  return (
    <div>
      {years.map((year: number) => {
        const donationsInYear = donations
          .filter(donation => new Date(donation.timestamp).getFullYear() == year)
          .sort((a,b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        let taxDeductions = donationsInYear
          .reduce((acc, curr) => acc + parseFloat(curr.sum),0)

        taxDeductions = Math.min(taxDeductions, 50000)
        
          return (
          <div className={style.gridContainer} key={year}>
            <section className={style.header}>
              <h2>{year}</h2>
              <p>
                Dine donasjoner i {year} kvalifiserte deg for <div>{thousandize(taxDeductions)}</div> kroner i
                skattefradrag
              </p>
            </section>
            <section>
              <table className={style.table}>
                <thead>
                  <th>Dato</th>
                  <th>Sum</th>
                  <th>Betalingskanal</th>
                  <th>KID</th>
                </thead>
                {donationsInYear
                  .map(donation => (
                    <DonationListRow key={donation.id} donation={donation}></DonationListRow>
                  ))}
              </table>
            </section>
          </div>
        );
      })}
    </div>
  );
};
import style from "../../styles/Lists.module.css";
import { Donation } from "../../models";

// export type Donation = {
//     KID: string;
//     donor: string;
//     donorId: number;
//     email: string;
//     id: number;
//     paymentMethod: string;
//     sum: string;
//     timestamp: string;
//     transactionCost: string;
//   };

export const DonationList: React.FC = () => {
  let donationlist = {
    donations: [
      {
        KID: "23456098765",
        donor: "Anniken Hoff",
        donorId: 2348,
        email: "anniken.hoff@hotmail.com",
        id: 23456765,
        paymentMethod: "AvtaleGiro",
        sum: "900,00",
        timestamp: "2021-01-01 23:23:06",
        transactionCost: "30",
      },
      {
        KID: "678923829",
        donor: "Anniken Hoff",
        donorId: 2348,
        email: "anniken.hoff@hotmail.com",
        id: 9875678,
        paymentMethod: "AvtaleGiro",
        sum: "800,00",
        timestamp: "2021-07-01 23:23:06",
        transactionCost: "30",
      },
      {
        KID: "803998327",
        donor: "Anniken Hoff",
        donorId: 2348,
        email: "anniken.hoff@hotmail.com",
        id: 90328,
        paymentMethod: "Bank",
        sum: "700,00",
        timestamp: "2020-07-01 23:23:06",
        transactionCost: "30",
      },
      {
        KID: "039294389",
        donor: "Anniken Hoff",
        donorId: 2348,
        email: "anniken.hoff@hotmail.com",
        id: 5671402,
        paymentMethod: "AvtaleGiro",
        sum: "600,00",
        timestamp: "2019-07-01 23:23:06",
        transactionCost: "30",
      },
      {
        KID: "93120647930",
        donor: "Anniken Hoff",
        donorId: 2348,
        email: "anniken.hoff@hotmail.com",
        id: 137840,
        paymentMethod: "Bank",
        sum: "500,00",
        timestamp: "2019-03-01 23:23:06",
        transactionCost: "30",
      },
    ],
  };

  function getYears() {
    let years: number[] = [];
    donationlist.donations.map((donation: Donation) => {
      let year = new Date(donation.timestamp).getFullYear();
      years.includes(year) ? null : years.push(year);
    });
    return years;
  }

  function tableGenerator(year: number) {
    let listAttributes: JSX.Element[] = [];
    donationlist.donations.map((donation: Donation) => {
      let thisYear = new Date(donation.timestamp).getFullYear();
      if (year == thisYear) {
        listAttributes.push(
          <tr key={donation.id}>
            <td>{donation.timestamp}</td>
            <td>{donation.sum}kr</td>
            <td>{donation.paymentMethod}</td>
            <td>{donation.KID}</td>
          </tr>
        );
      }
    });
    return (
      <table className={style.table}>
        <th>
          <td>Dato</td>
          <td>Sum</td>
          <td>Betalingskanal</td>
          <td>KID</td>
        </th>
        <tbody>{listAttributes}</tbody>
      </table>
    );
  }

  let allYears = getYears();
  allYears.sort().reverse();
  return (
      <div>
        {allYears.map((year: number) => {
          return (
            <div className={style.gridContainer}>
              <section>
                <hr />
                <br />
                <h2>{year}</h2>
                <p>Dine donasjoner i {year} kvalifiserte deg for XXXXX kroner i skattefradrag</p>
              </section>
              <section>
                <hr /> 
                <br /> 
                {tableGenerator(year)}
              </section>
            </div>
          );
        })}
      </div>
  );
};

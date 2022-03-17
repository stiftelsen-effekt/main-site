import React from "react";
import style from "../../../styles/Donations.module.css";
import { thousandize } from "../../../util/formatting";


const DonationsDistributionTable: React.FC<{ distribution: {org: string, sum: number }[] }> = ({ distribution }) => {
  distribution = distribution
    .sort((a,b) => b.sum - a.sum)
    .map(row => ({ ...row, sum: Math.floor(row.sum) }))
  
  return (
    <div>
      <table className={style.distribution}>
        <tbody>
          {distribution.map((row) => (
            <tr key={row.org}>
              <td>{row.org}</td>
              <td>{thousandize(row.sum)} kr</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DonationsDistributionTable
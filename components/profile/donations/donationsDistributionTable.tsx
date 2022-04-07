import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import style from "../../../styles/Donations.module.css";
import { thousandize } from "../../../util/formatting";


const DonationsDistributionTable: React.FC<{ distribution: {org: string, sum: number }[] }> = ({ distribution }) => {
  distribution = distribution
    .sort((a,b) => b.sum - a.sum)
    .map(row => ({ ...row, sum: Math.floor(row.sum) }))

  const [expanded, setExpanded] = useState(true)
  
  return (
    <div className={style.distribution} data-cy="aggregated-distribution-table">
      <div className={style.distributionHeader} onClick={() => setExpanded(!expanded)}>
        <span>Fordeling</span>
        <ChevronDown size={24} color={'white'} className={expanded ? style.chevronRotated : ''} />
      </div>
      <AnimateHeight height={expanded ? 'auto' : 0}>
        <table>
          <tbody>
            {distribution.map((row) => (
              <tr key={row.org}>
                <td>{row.org}</td>
                <td>{thousandize(row.sum)} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AnimateHeight>
    </div>
  )
}

export default DonationsDistributionTable
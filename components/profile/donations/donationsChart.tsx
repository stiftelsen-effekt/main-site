import { doesNotThrow } from "assert";
import React from "react"
import style from "../../../styles/Donations.module.css";
import { thousandize } from "../../../util/formatting";


const DonationsChart: React.FC<{ distribution: {org: string, sum: number }[] }> = ({ distribution }) => {
  const total = distribution.reduce((acc, curr) => acc + curr.sum, 0)

  distribution = distribution.sort((a,b) => b.sum - a.sum)

  return (
    <div className={style.graph + ' ' + (distribution.length == 0 ? style.empty : '')}>
      {distribution.map((dist, i) => (
        <div 
          key={dist.org} 
          style={{ 
            width: `${(dist.sum / total) * 100}%`,
            zIndex: distribution.length - i 
          }}>
            <span>{dist.org}</span>
            <span>{thousandize(Math.floor(dist.sum)) + " kr"}</span>
        </div>
      ))}
    </div>
  )
}

export default DonationsChart
import React, { useState } from "react";
import style from "../../styles/Lists.module.css";
import { Donation } from "../../models";
import { ChevronDown, FileText } from "react-feather"
import { shortDate, thousandize } from "../../util/formatting"

const DonationListRow: React.FC<{donation: Donation}> = ({ donation }) => {
  const [expanded, setExpanded] = useState<boolean>();

  return (
    <tbody>
      <tr key={donation.id}>
        <td>{shortDate(donation.timestamp)}</td>
        <td>{thousandize(Math.round(parseFloat(donation.sum)))} kr</td>
        <td>{donation.paymentMethod}</td>
        <td>{donation.KID}</td>
        <td onClick={() => setExpanded(!expanded)} >
          <ChevronDown className={(expanded ? style.iconChevronUp : style.iconChevronDown)} color={"white"} width={24} />
        </td>
      </tr>
      <tr>
        <td colSpan={Number.MAX_SAFE_INTEGER} className={(expanded ? style.expanded : style.collapsed)}>
          <div className={style.expanderContent}>
            <div className={style.distributionGraph}>
              
            </div>
            <div className={style.contextMenu}>
              <a><FileText width={18} color={"white"}></FileText><span>Kvittering</span></a>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  )
}

export default DonationListRow
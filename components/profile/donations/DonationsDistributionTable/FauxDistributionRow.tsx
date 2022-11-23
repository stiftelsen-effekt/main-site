import React, { useState } from "react";
import { ChevronDown } from "react-feather";
import style from "./DonationsDistributionTable.module.scss";

export const FauxDistributionRow: React.FC<{
  outputkey: string;
  formattedOutput: string;
}> = ({ outputkey, formattedOutput }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr key={outputkey} onClick={() => setExpanded(!expanded)} className={style.fauxrow}>
        <td>
          <strong>{formattedOutput}</strong>&nbsp;<span>{outputkey}</span>
        </td>
        <td className={style.rowexpand}>
          <ChevronDown
            size={"1.3rem"}
            color={"white"}
            style={{ transform: expanded ? "rotate(180deg)" : "" }}
          />
        </td>
      </tr>
      <tr key={`${outputkey}-expander`}>
        <td colSpan={2}></td>
      </tr>
    </>
  );
};

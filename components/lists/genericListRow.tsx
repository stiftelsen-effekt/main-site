import React, { useState } from "react";
import style from "../../styles/Lists.module.css";
import { ListRow } from "./genericList";
import { ChevronDown } from "react-feather";
import AnimateHeight from "react-animate-height";

const GenericListRow: React.FC<{row: ListRow}> = ({ row }) => {
  const [expanded, setExpanded] = useState<boolean>();

  return (
    <tbody>
      <tr key={row.id}>
        {row.cells.map((val, i) => <td key={i}>{val}</td>)}
        <td onClick={() => setExpanded(!expanded)} >
          <ChevronDown className={(expanded ? style.iconChevronUp : style.iconChevronDown)} color={"white"} width={24} />
        </td>
      </tr>
      <tr>
        <td colSpan={Number.MAX_SAFE_INTEGER} >
          <AnimateHeight height={expanded ? 'auto' : 0} animateOpacity={true}>
            {row.details}
          </AnimateHeight>
        </td>
      </tr>
    </tbody>
  )
}

export default GenericListRow
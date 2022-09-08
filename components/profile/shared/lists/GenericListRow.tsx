import React, { useState } from "react";
import style from "./Lists.module.scss";
import { ListRow } from "./GenericList";
import { ChevronDown } from "react-feather";
import AnimateHeight from "react-animate-height";
import { useInView } from "react-hook-inview";

const GenericListRow: React.FC<{ row: ListRow; expandable?: boolean }> = ({
  row,
  expandable = true,
}) => {
  const [expanded, setExpanded] = useState<boolean>();
  const [ref, isInView] = useInView();

  return (
    <tbody ref={ref}>
      <tr key={row.id}>
        {row.cells.map((val, i) => (
          <td key={i}>{val}</td>
        ))}
        {expandable ? (
          <td onClick={() => setExpanded(!expanded)} data-cy="generic-list-row-expand">
            <ChevronDown
              className={expanded ? style.iconChevronUp : style.iconChevronDown}
              color={"black"}
              width={24}
            />
          </td>
        ) : (
          <td></td>
        )}
      </tr>
      {expandable ? (
        <tr>
          <td colSpan={Number.MAX_SAFE_INTEGER}>
            <AnimateHeight height={expanded ? "auto" : 0} animateOpacity={true}>
              {(expanded || isInView) && row.details}
            </AnimateHeight>
          </td>
        </tr>
      ) : null}
    </tbody>
  );
};

export default GenericListRow;

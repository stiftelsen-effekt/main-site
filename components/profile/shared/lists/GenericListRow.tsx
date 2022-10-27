import React, { useRef, useState } from "react";
import style from "./Lists.module.scss";
import { ListRow } from "./GenericList";
import { ChevronDown, MoreHorizontal } from "react-feather";
import AnimateHeight from "react-animate-height";
import {
  GenericListContextMenu,
  GenericListContextMenuOptions,
  GenericListContextMenuSelect,
} from "./GenericListContextMenu";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";

const GenericListRow: React.FC<{
  row: ListRow;
  expandable?: boolean;
}> = ({ row, expandable = true }) => {
  const [expanded, setExpanded] = useState<boolean>();
  const [contextOpen, setContextOpen] = useState<boolean>(false);

  const actionRef = useRef<HTMLDivElement>(null);
  useClickOutsideAlerter(actionRef, () => setContextOpen(false));

  let action = null;
  if (expandable) {
    action = (
      <td
        onClick={() => setExpanded(!expanded)}
        className={style.rowAction}
        data-cy="generic-list-row-expand"
      >
        <ChevronDown
          className={expanded ? style.iconChevronUp : style.iconChevronDown}
          color={"black"}
          width={24}
        />
      </td>
    );
  } else if (typeof row.contextOptions !== "undefined") {
    action = (
      <td
        onClick={() => setContextOpen(!contextOpen)}
        className={style.rowAction}
        data-cy="generic-list-row-context"
      >
        <div ref={actionRef}>
          <MoreHorizontal width={24} />
          <div className={style.contextDropdownWrapper}>
            {contextOpen && (
              <GenericListContextMenu
                options={row.contextOptions}
                onSelect={(selected: string) =>
                  row.onContextSelect ? row.onContextSelect(selected) : () => {}
                }
              />
            )}
          </div>
        </div>
      </td>
    );
  }

  return (
    <tbody>
      <tr key={row.id}>
        {row.cells.map((val, i) => (
          <td key={i}>{val}</td>
        ))}
        {action}
      </tr>
      {expandable ? (
        <tr>
          <td colSpan={Number.MAX_SAFE_INTEGER}>
            <AnimateHeight height={expanded ? "auto" : 0} animateOpacity={true}>
              {row.details}
            </AnimateHeight>
          </td>
        </tr>
      ) : null}
    </tbody>
  );
};

export default GenericListRow;

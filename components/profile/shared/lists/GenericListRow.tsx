import React, { ReactElement, useRef, useState } from "react";
import style from "./Lists.module.scss";
import { ChevronDown, Info, MoreHorizontal } from "react-feather";
import AnimateHeight from "react-animate-height";
import {
  GenericListContextMenu,
  GenericListContextMenuOptions,
  GenericListContextMenuSelect,
} from "./GenericListContextMenu";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import { useInView } from "react-hook-inview";

export type ListRowCell = {
  value: string;
  tooltip?: string;
  align?: "left" | "right";
};

export type ListRow<T> = {
  id: string;
  defaultExpanded: boolean;
  cells: ListRowCell[];
  details?: ReactElement;
  contextOptions?: GenericListContextMenuOptions;
  onContextSelect?: GenericListContextMenuSelect<T>;
  element: T;
};

type Props<T> = {
  row: ListRow<T>;
  expandable?: boolean;
};

const GenericListRow = <T extends unknown>({ row, expandable }: Props<T>) => {
  const [expanded, setExpanded] = useState<boolean>(row.defaultExpanded);
  const [contextOpen, setContextOpen] = useState<boolean>(false);

  const [ref, isInView] = useInView();

  const actionRef = useRef<HTMLDivElement>(null);
  useClickOutsideAlerter(actionRef, () => setContextOpen(false));

  let actions = [];

  if (typeof row.contextOptions !== "undefined") {
    actions.push(
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setContextOpen(!contextOpen);
        }}
        data-cy="generic-list-row-context"
        className={style.actionContainer}
        key={row.id + "-context"}
      >
        <div ref={actionRef} style={{ display: "flex", flexDirection: "column" }}>
          <MoreHorizontal width={24} />
          <div className={style.contextDropdownWrapper}>
            {contextOpen && (
              <GenericListContextMenu
                options={row.contextOptions}
                element={row.element}
                onSelect={(selected: string) =>
                  row.onContextSelect ? row.onContextSelect(selected, row.element) : () => {}
                }
              />
            )}
          </div>
        </div>
      </div>,
    );
  }
  if (expandable) {
    actions.push(
      <div
        onClick={() => setExpanded(!expanded)}
        data-cy="generic-list-row-expand"
        className={style.actionContainer}
        key={row.id + "-expand"}
      >
        <ChevronDown
          className={expanded ? style.iconChevronUp : style.iconChevronDown}
          color={"black"}
          width={"24px"}
        />
      </div>,
    );
  }

  return (
    <tbody ref={ref}>
      <tr
        key={row.id}
        onClick={() => {
          expandable && window.innerWidth > 1180 ? setExpanded(!expanded) : expanded;
        }}
        data-cy="generic-list-row-expand"
        className={expandable ? style.expandableRow : ""}
      >
        {row.cells.map((cell: ListRowCell, i: number) => (
          <td key={i}>
            {cell.value}
            {cell.tooltip ? (
              <div className={style.cellTooltip}>
                <div className={style.cellTooltipContent}>
                  <Info size={"1rem"} />
                  {cell.tooltip}
                </div>
                <Info size={"1rem"} />
              </div>
            ) : null}
          </td>
        ))}
        <td className={style.rowAction}>{actions.map((action, i) => action)}</td>
      </tr>
      {expandable ? (
        <tr key={`${row.id}-expanded`}>
          <td colSpan={Number.MAX_SAFE_INTEGER} className={style.detailRowCell}>
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

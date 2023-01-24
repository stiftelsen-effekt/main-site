import style from "./Lists.module.scss";
import GenericListRow, { ListRow } from "./GenericListRow";
import React, { ReactElement } from "react";
import {
  GenericListContextMenuOptions,
  GenericListContextMenuSelect,
} from "./GenericListContextMenu";

export type Props<T> = {
  title: string;
  headers: { label: string; width?: string }[];
  supplementalInformation?: string | JSX.Element;
  rows: ListRow<T>[];
  emptyPlaceholder: JSX.Element;
  proportions: number[];
  expandable?: boolean;
  children?: ReactElement;
};

export const GenericList = <T extends unknown>({
  headers,
  title,
  supplementalInformation,
  rows,
  emptyPlaceholder,
  proportions,
  expandable,
  children,
}: Props<T>) => {
  const hasActions = rows.some((row) => typeof row.contextOptions !== "undefined") || expandable;

  return (
    <div
      className={style.gridContainer}
      style={{ gridTemplateColumns: `${proportions.map((p) => p.toString() + "%").join(" ")}` }}
      key={title}
      data-cy="generic-list"
    >
      <section className={style.header} data-cy="generic-list-header">
        <h3>{title}</h3>
        {supplementalInformation}
      </section>
      <section>
        {rows.length > 0 ? (
          <table className={style.table} data-cy="generic-list-table">
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={header.label}
                    style={{ width: header.width ?? "auto" }}
                    colSpan={hasActions && i === headers.length - 1 ? 2 : 1}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            {rows.map((row) => (
              <GenericListRow key={row.id} row={row} expandable={expandable}></GenericListRow>
            ))}
          </table>
        ) : (
          emptyPlaceholder
        )}
        {children}
      </section>
    </div>
  );
};

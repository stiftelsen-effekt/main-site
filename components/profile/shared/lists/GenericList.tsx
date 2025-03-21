import style from "./Lists.module.scss";
import GenericListRow, { ListRow } from "./GenericListRow";
import React, { ReactElement, ReactNode } from "react";

export type Props<T> = {
  title: string;
  headers: { label: string; width?: string; align?: "right" }[];
  supplementalInformation?: string | ReactNode;
  rows: ListRow<T>[];
  emptyPlaceholder: ReactNode;
  proportions: number[];
  expandable?: boolean;
  supplementalOnMobile?: boolean;
  linedRows?: boolean;
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
  supplementalOnMobile = false,
  linedRows = false,
  children,
}: Props<T>) => {
  const hasActions = rows.some((row) => typeof row.contextOptions !== "undefined") || expandable;

  return (
    <div
      className={[
        style.gridContainer,
        supplementalOnMobile ? style.supplementalOnMobile : "",
        linedRows ? style.linedRows : "",
      ].join(" ")}
      style={{ gridTemplateColumns: `${proportions.map((p) => p.toString() + "%").join(" ")}` }}
      key={title}
      data-cy="generic-list"
    >
      <section className={style.header} data-cy="generic-list-header">
        <h3 data-cy="generic-list-header-title">{title}</h3>
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
                    align={header.align ?? "left"}
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
          <div data-cy="generic-list-empty-placeholder">{emptyPlaceholder}</div>
        )}
        {children}
      </section>
    </div>
  );
};

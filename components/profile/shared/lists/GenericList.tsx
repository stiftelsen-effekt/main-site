import style from "./Lists.module.scss";
import GenericListRow from "./GenericListRow";
import React, { ReactElement } from "react";

export type ListRow = {
  id: string;
  isFirstRow: boolean;
  cells: string[];
  details: ReactElement;
};

export const GenericList: React.FC<{
  title: string;
  supplementalInformation?: string | JSX.Element;
  headers: string[];
  rows: ListRow[];
  emptyPlaceholder: JSX.Element;
  expandable?: boolean;
}> = ({ headers, title, supplementalInformation, rows, emptyPlaceholder, expandable }) => {
  return (
    <div className={style.gridContainer} key={title} data-cy="generic-list">
      <section className={style.header} data-cy="generic-list-header">
        <h3>{title}</h3>
        <p>{supplementalInformation}</p>
      </section>
      <section>
        {rows.length > 0 ? (
          <table className={style.table} data-cy="generic-list-table">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
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
      </section>
    </div>
  );
};

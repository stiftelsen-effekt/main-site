import style from "../../styles/Lists.module.css";
import GenericListRow from "./genericListRow";
import React, { ReactElement } from "react";

export type ListRow = {
  id: string;
  cells: string[];
  details: ReactElement;
}

export const GenericList: React.FC<{ 
    title: string, 
    supplementalInformation: string,
    headers: string[], 
    rows: ListRow[],
    emptyPlaceholder: JSX.Element
     }> = ({ 
    headers, 
    title, 
    supplementalInformation,
    rows,
    emptyPlaceholder }) => {
  return (
    <div className={style.gridContainer} key={title} data-cy="generic-list">
      <section className={style.header} data-cy="generic-list-header">
        <h2>{title}</h2>
        <p>{supplementalInformation}</p>
      </section>
      <section>
        {rows.length > 0 ?
          <table className={style.table} data-cy="generic-list-table">
            <thead>
              <tr>
                {headers.map(header => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            {rows
              .map(row => (
                <GenericListRow key={row.id} row={row}></GenericListRow>
              ))}
          </table> :
          emptyPlaceholder
        }
      </section>
    </div>
  );
};
import { useRouter } from "next/router";
import React from "react";
import styles from "./Columns.module.scss";
import { LinkType, Links } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
export interface Columns {
  columns: { _key: string; title: string; paragraph: string; links: Array<LinkType | NavLink> }[];
}
export const Columns: React.FC<Columns> = ({ columns }) => {
  const router = useRouter();

  return (
    <div className={styles.grid}>
      {columns.map((column) => (
        <div className={styles.column} key={column._key}>
          <div>
            <h5>{column.title}</h5>
            <p>{column.paragraph}</p>
          </div>
          {column.links && <Links links={column.links} />}
        </div>
      ))}
    </div>
  );
};

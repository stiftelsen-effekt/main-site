import { useRouter } from "next/router";
import React from "react";
import styles from "./Columns.module.scss";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
export interface Columns {
  columns: { _key: string; title: string; paragraph: string; link: string }[];
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
          {column.link && (
            <EffektButton
              onClick={() => {
                router.push(column.link);
              }}
            >
              Les mer
            </EffektButton>
          )}
        </div>
      ))}
    </div>
  );
};

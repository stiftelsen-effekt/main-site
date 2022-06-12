import React from "react";
import styles from "../../styles/Contributors.module.css";
import { Contributor, ContributorType } from "./contributor";

export type Role = {
  title: string;
  id: "boardmembers" | "volunteers" | "employees";
  contributors: ContributorType[];
};

export const Contributors: React.FC<Role> = ({ title, contributors }) => {
  return (
    <div className={styles.contributors}>
      <h2 className={styles.contributors__title}>{title}</h2>
      <ul className={styles.contributors__list}>
        {contributors.map((member) => (
          <Contributor key={member._id} {...member} />
        ))}
      </ul>
    </div>
  );
};

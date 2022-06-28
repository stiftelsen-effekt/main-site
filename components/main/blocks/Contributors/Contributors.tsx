import React from "react";
import styles from "./Contributors.module.scss";
import { Contributor, ContributorType } from "./Contributor";

export type Role = {
  title: string;
  id: "boardmembers" | "volunteers" | "employees";
  contributors: ContributorType[];
};

export const Contributors: React.FC<Role> = ({ title, contributors }) => {
  return (
    <div className={styles.contributors}>
      <h5 className={styles.contributors__title}>{title}</h5>
      <div className={styles.contributors__list}>
        {contributors.map((member) => (
          <Contributor key={member._id} {...member} />
        ))}
      </div>
    </div>
  );
};

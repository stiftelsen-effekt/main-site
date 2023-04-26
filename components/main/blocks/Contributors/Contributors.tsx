import React from "react";
import styles from "./Contributors.module.scss";
import { Contributor, ContributorType } from "./Contributor";

export const Contributors: React.FC<{
  title: string;
  contributors: ContributorType[];
  displayImages?: boolean;
}> = ({ title, contributors, displayImages = true }) => {
  return (
    <div className={styles.contributors}>
      <h4 className={styles.contributors__title}>{title}</h4>
      <div className={styles.contributors__list}>
        {contributors.map((member) => (
          <Contributor key={member._id} displayImage={displayImages} {...member} />
        ))}
      </div>
    </div>
  );
};

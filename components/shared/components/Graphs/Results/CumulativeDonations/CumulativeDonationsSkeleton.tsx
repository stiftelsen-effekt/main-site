import React from "react";
import styles from "./CumulativeDonationsSkeleton.module.scss";

export const CumulativeDonationsSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.graph} />
      <style>{`
          
        `}</style>
    </div>
  );
};

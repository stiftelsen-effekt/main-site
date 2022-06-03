import React from "react";
import styles from "../../styles/CookieBanner.module.css";

export const CookieBanner: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <span>Cookies</span>
          <p>
            Vi bruker informasjonskapsler (cookies) for å kunne tilby en så god brukeropplevelse som
            mulig.
          </p>
        </div>
        <button onClick={onAccept}>Aksepter</button>
      </div>
    </div>
  );
};

import React from "react";
import styles from "../styles/Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.grid}>
      <div className={styles.category}>
        <h3>Konduit.</h3>

        <ul>
          <li>Doner</li>
          <li>Presse</li>
          <li>Scorecard</li>
          <li>Gavekort</li>
          <li>The pledge</li>
        </ul>
      </div>

      <div className={styles.category}>
        <h3>Hjelp</h3>

        <ul>
          <li>Kontakt</li>
          <li>FAQ</li>
          <li>Min donasjonshistorikk</li>
          <li>Vilkår og betingelser</li>
          <li>Personvernserklæring</li>
        </ul>
      </div>

      <div className={styles.category}>
        <h3>Social</h3>

        <ul>
          <li>Facebook</li>
          <li>Twitter</li>
          <li>Youtube</li>
          <li>Linkedin</li>
          <li>Blog</li>
        </ul>
      </div>

      <div className={styles.category}>
        <h3>Meld meg på nyhetsbrevet</h3>

        <input type="text" className={styles.newsletter} placeholder="E-post" />
      </div>

      <div className={styles.category}>
        <h3>&nbsp;</h3>
        <span>Personvern</span>
      </div>

      <div className={styles.category}>
        <h3>&nbsp;</h3>
        <div>Til toppen av siden</div>
      </div>
    </footer>
  );
};

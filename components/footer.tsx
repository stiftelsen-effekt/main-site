import React from "react";
import styles from "../styles/Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.grid}>
      <div className={`${styles.category} ${styles.logo__bottom}`}>
        <figure>
          <p>G</p>
        </figure>
      </div>

      <div className={`${styles.category} ${styles.primary__links}`}>
        {/* <h3>Konduit.</h3> */}

        <ul>
          <li>
            <a href="#">Om oss</a>
          </li>
          <li>
            <a href="#">Medieomtale</a>
          </li>
          <li>
            <a href="#">Resultater</a>
          </li>
          {/* <li>Gavekort</li>
          <li>The pledge</li> */}
        </ul>
      </div>

      <div className={`${styles.category} ${styles.secondary__links}`}>
        {/* <h3>Hjelp</h3> */}

        <ul>
          <li>
            <a href="#">Hvorfor Gi Effektivt?</a>
          </li>
          <li>
            <a href="#">Blogg</a>
          </li>
          <li>
            <a href="#">Support</a>
          </li>
          {/* <li>Kontakt</li>
          <li>FAQ</li>
          <li>Min donasjonshistorikk</li>
          <li>Vilkår og betingelser</li>
          <li>Personvernserklæring</li> */}
        </ul>
      </div>

      <div className={`${styles.category} ${styles.tertiary__links}`}>
        <ul>
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
          <li>
            <a href="#">Youtube</a>
          </li>
          <li>
            <a href="#">Linkedin</a>
          </li>
        </ul>
      </div>

      <div className={`${styles.category} ${styles.utillity}`}>
        <a href="#">Personvern</a>
        <p> &#169; 2022 Gi Effektivt</p>
        <a href="#top">Til toppen &uarr;</a>
      </div>

      <form className={`${styles.category} ${styles.newsletter}`}>
        <fieldset>
          <label className={styles.newsletter__label} htmlFor="nyhetsbrev">
            Meld meg på nyhetsbrevet
          </label>

          <div className={styles.input__inlinebutton}>
            <input type="text" name="nyhetbrev" placeholder="E-post" />
            <button aria-label="send e-post">SEND&nbsp;→</button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

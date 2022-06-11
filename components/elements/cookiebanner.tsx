import React, { useEffect, useState } from "react";
import styles from "../../styles/CookieBanner.module.css";

export const CookieBanner: React.FC = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(
    typeof window !== "undefined"
      ? window.localStorage.getItem("gieffektivt-cookies-accepted")
      : "false",
  );

  useEffect(() => {
    if (cookiesAccepted === "true") {
      console.log("Cookies accepted");
    }
  }, [cookiesAccepted]);

  return (
    <div
      className={styles.container}
      style={{ display: cookiesAccepted === "true" ? "none" : "flex" }}
    >
      <div className={styles.content}>
        <div>
          <span>Cookies</span>
          <p>
            Vi bruker informasjonskapsler (cookies) for å kunne tilby en så god brukeropplevelse som
            mulig.
          </p>
        </div>
        <button
          onClick={() => {
            window.localStorage.setItem("gieffektivt-cookies-accepted", "true");
            setCookiesAccepted("true");
          }}
        >
          Aksepter
        </button>
      </div>
    </div>
  );
};

import Script from "next/script";
import React, { useContext, useEffect, useState } from "react";
import { CookiesAccepted } from "../../../main/layout/layout";
import styles from "./CookieBanner.module.scss";

export const CookieBanner: React.FC = () => {
  const [cookiesAccepted, setCookiesAccepted] = useContext(CookiesAccepted);
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    setCookiesAccepted(
      typeof window !== "undefined"
        ? window.localStorage.getItem("gieffektivt-cookies-accepted") === "true"
        : false,
    )
    setLocalStorageLoaded(true);
    },
    []
  );

  return (
    <>
      {cookiesAccepted && localStorageLoaded && typeof window !== "undefined" && (
        <>
          <Script
            strategy="afterInteractive"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          ></Script>
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
    
              gtag('config', '${gaMeasurementId}');
        `}
          </Script>
        </>
      )}
      <div data-cy="cookiebanner-container" className={styles.container} style={{ display: cookiesAccepted ? "none" : "flex" }}>
        <div className={styles.content}>
          <div>
            <span>Cookies</span>
            <p>
              Vi bruker informasjonskapsler (cookies) for å kunne tilby en så god brukeropplevelse
              som mulig.
            </p>
          </div>
          <button
            data-cy="accept-cookies"
            onClick={() => {
              window.localStorage.setItem("gieffektivt-cookies-accepted", "true");
              setCookiesAccepted(true);
            }}
          >
            Aksepter
          </button>
        </div>
      </div>
    </>
  );
};

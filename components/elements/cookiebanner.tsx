import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import styles from "../../styles/CookieBanner.module.css";

export const CookieBanner: React.FC = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState<null | string>("false");
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(
    () =>
      setCookiesAccepted(
        typeof window !== "undefined"
          ? window.localStorage.getItem("gieffektivt-cookies-accepted")
          : "false",
      ),
    [],
  );

  return (
    <>
      {cookiesAccepted === "true" && typeof window !== "undefined" && (
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
      <div
        className={styles.container}
        style={{ display: cookiesAccepted === "true" ? "none" : "flex" }}
      >
        <div className={styles.content}>
          <div>
            <span>Cookies</span>
            <p>
              Vi bruker informasjonskapsler (cookies) for å kunne tilby en så god brukeropplevelse
              som mulig.
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
    </>
  );
};

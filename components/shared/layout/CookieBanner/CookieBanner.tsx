import Script from "next/script";
import React, { useContext, useEffect, useState } from "react";
import { CookiesAccepted } from "../../../main/layout/layout";
import styles from "./CookieBanner.module.scss";

export type CookieBannerConfiguration = {
  title: string;
  description: string;
  accept_button_text: string;
  decline_button_text: string;
};
export const CookieBanner: React.FC<{ configuration: CookieBannerConfiguration }> = ({
  configuration,
}) => {
  const [cookiesAccepted, setCookiesAccepted] = useContext(CookiesAccepted);
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("gieffektivt-cookies-accepted");
      if (item !== null) {
        if (item === "true") {
          setCookiesAccepted(true);
        } else if (item === "false") {
          setCookiesAccepted(false);
        }
      }
      setLocalStorageLoaded(true);
    }
  }, []);

  return (
    <>
      {cookiesAccepted === true && localStorageLoaded && typeof window !== "undefined" && (
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
        data-cy="cookiebanner-container"
        className={styles.container}
        style={{ display: typeof cookiesAccepted === "undefined" ? "flex" : "none" }}
      >
        <div className={styles.content}>
          <div>
            <span>{configuration.title}</span>
            <p>{configuration.description}</p>
          </div>
          <div>
            <button
              data-cy="decline-cookies"
              onClick={() => {
                window.localStorage.setItem("gieffektivt-cookies-accepted", "false");
                setCookiesAccepted(false);
              }}
              style={{
                marginRight: "1rem",
              }}
            >
              {configuration.decline_button_text}
            </button>
            <button
              data-cy="accept-cookies"
              onClick={() => {
                window.localStorage.setItem("gieffektivt-cookies-accepted", "true");
                setCookiesAccepted(true);
              }}
            >
              {configuration.accept_button_text}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

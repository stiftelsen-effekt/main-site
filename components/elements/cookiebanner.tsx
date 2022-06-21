import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/CookieBanner.module.css";
import { CookiesAccepted } from "../main/layout";

export const CookieBanner: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (window as any).gtag("event", "page_view");
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const [cookiesAccepted, setCookiesAccepted] = useContext(CookiesAccepted);
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(
    () =>
      setCookiesAccepted(
        typeof window !== "undefined"
          ? window.localStorage.getItem("gieffektivt-cookies-accepted") === "true"
          : false,
      ),
    [],
  );

  return (
    <>
      {cookiesAccepted && typeof window !== "undefined" && (
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
      <div className={styles.container} style={{ display: cookiesAccepted ? "none" : "flex" }}>
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

import Script from "next/script";
import React, { useContext, useEffect, useState } from "react";
import { CookiesAccepted } from "../../../main/layout/layout";
import { GoogleTagManager } from "../GoogleTagManager";
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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("gieffektivt-cookies-accepted");
      console.log(item);
      if (item !== null) {
        if (item === "true") {
          setCookiesAccepted({
            accepted: true,
            loaded: true,
          });
        } else if (item === "false") {
          setCookiesAccepted({
            accepted: false,
            loaded: true,
          });
        }
      } else {
        setCookiesAccepted({
          loaded: true,
        });
      }
    }
  }, [setCookiesAccepted]);

  return (
    <>
      {cookiesAccepted.accepted === true && gaMeasurementId && (
        <GoogleTagManager gtmId={gaMeasurementId} />
      )}
      {cookiesAccepted.loaded && typeof cookiesAccepted.accepted === "undefined" && (
        <div data-cy="cookiebanner-container" className={styles.container}>
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
                  setCookiesAccepted({
                    accepted: false,
                    loaded: true,
                  });
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
                  setCookiesAccepted({
                    accepted: true,
                    loaded: true,
                  });
                }}
              >
                {configuration.accept_button_text}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

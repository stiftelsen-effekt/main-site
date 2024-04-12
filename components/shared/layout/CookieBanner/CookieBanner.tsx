import React, { useContext, useEffect } from "react";
import { CookiesAccepted } from "../../../main/layout/layout";
import { GoogleAnalytics } from "../GoogleAnalytics";
import { GoogleTagManager } from "../GoogleTagManager";
import styles from "./CookieBanner.module.scss";
import { NavLink } from "../../components/Navbar/Navbar";
import { LinkComponent } from "../../../main/blocks/Links/Links";
import { HotJar } from "../HotJar";

export type CookieBannerConfiguration = {
  title: string;
  description: string;
  privacy_policy_link: NavLink;
  accept_button_text: string;
  decline_button_text: string;
  last_major_change: string;
  expired_template: string;
};
export const CookieBanner: React.FC<{ configuration: CookieBannerConfiguration }> = ({
  configuration,
}) => {
  const [cookiesAccepted, setCookiesAccepted] = useContext(CookiesAccepted);
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("gieffektivt-cookies-accepted");
      const acceptedDateItem = window.localStorage.getItem("gieffektivt-cookies-accepted-date");
      if (item !== null) {
        const acceptedDate = acceptedDateItem ? new Date(acceptedDateItem) : new Date(1970, 0, 1);
        const lastMajorChange = configuration.last_major_change
          ? new Date(configuration.last_major_change)
          : new Date(1970, 0, 1);
        const expired = acceptedDate < lastMajorChange;
        if (item === "true" && !expired) {
          setCookiesAccepted({
            accepted: true,
            loaded: true,
          });
        } else if (item === "true" && expired) {
          setCookiesAccepted({
            expired: true,
            lastMajorChange: lastMajorChange,
            loaded: true,
          });
        } else if (item === "false") {
          setCookiesAccepted({
            accepted: false,
            expired: false,
            lastMajorChange: lastMajorChange,
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

  let privacyPolicyLink = configuration.privacy_policy_link;
  if (cookiesAccepted.expired && cookiesAccepted.lastMajorChange) {
    privacyPolicyLink = {
      ...configuration.privacy_policy_link,
      title: `${configuration.privacy_policy_link.title} ${configuration.expired_template.replace(
        "{date}",
        cookiesAccepted.lastMajorChange.toLocaleDateString("no-NB"),
      )}`,
    };
  }

  return (
    <>
      {cookiesAccepted.accepted === true && cookiesAccepted.expired !== true && (
        <>
          {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
          {gaMeasurementId ? <GoogleAnalytics gaMeasurementId={gaMeasurementId} /> : null}
          {hotjarId ? <HotJar hotjarId={hotjarId} /> : null}
        </>
      )}
      {cookiesAccepted.loaded && typeof cookiesAccepted.accepted === "undefined" && (
        <div data-cy="cookiebanner-container" className={styles.container}>
          <div className={styles.content}>
            <div className={styles.description}>
              <span className={styles.title}>{configuration.title}</span>
              <p>{configuration.description}</p>
              <LinkComponent link={privacyPolicyLink} style={{ border: "none" }} />
            </div>
            <div className={styles.buttonsWrapper}>
              <button
                data-cy="decline-cookies"
                onClick={() => {
                  window.localStorage.setItem("gieffektivt-cookies-accepted", "false");
                  setCookiesAccepted({
                    accepted: false,
                    expired: false,
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
                  window.localStorage.setItem(
                    "gieffektivt-cookies-accepted-date",
                    new Date().toISOString(),
                  );
                  setCookiesAccepted({
                    accepted: true,
                    expired: false,
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

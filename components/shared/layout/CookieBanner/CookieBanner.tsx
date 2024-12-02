import React, { useState } from "react";
import { GoogleAnalytics } from "../GoogleAnalytics";
import { GoogleTagManager } from "../GoogleTagManager";
import styles from "./CookieBanner.module.scss";
import { NavLink } from "../../components/Navbar/Navbar";
import { LinkComponent } from "../../../main/blocks/Links/Links";
import { HotJar } from "../HotJar";
import { ConsentState } from "../../../../middleware.page";
import { setCookie } from "cookies-next";

export type CookieBannerConfiguration = {
  title: string;
  description: string;
  privacy_policy_link: NavLink;
  accept_button_text: string;
  decline_button_text: string;
  last_major_change: string;
  expired_template: string;
};
export const CookieBanner: React.FC<{
  configuration: CookieBannerConfiguration;
  initialConsentState: ConsentState;
}> = ({ configuration, initialConsentState }) => {
  if (!configuration) return null;

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;

  const [consentState, setConsentState] = useState(initialConsentState);

  const setConsent = (state: ConsentState) => {
    setCookie("gieffektivt-cookies-accepted", state === "accepted" ? "true" : "false", {
      sameSite: "strict",
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    });
    setConsentState(state);
  };

  let privacyPolicyLink = configuration.privacy_policy_link;
  /*
  if (cookiesAccepted.expired && cookiesAccepted.lastMajorChange) {
    privacyPolicyLink = {
      ...configuration.privacy_policy_link,
      title: `${configuration.privacy_policy_link.title} ${configuration.expired_template.replace(
        "{date}",
        cookiesAccepted.lastMajorChange.toLocaleDateString("no-NB"),
      )}`,
    };
  }
    */

  return (
    <>
      {consentState === "accepted" && (
        <>
          {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
          {gaMeasurementId ? <GoogleAnalytics gaMeasurementId={gaMeasurementId} /> : null}
          {hotjarId ? <HotJar hotjarId={hotjarId} /> : null}
        </>
      )}
      {consentState === "undecided" && (
        <div data-cy="cookiebanner-container" className={styles.container}>
          <div className={styles.content}>
            <div className={styles.description}>
              <span className={styles.title}>{configuration.title}</span>
              <p>{configuration.description}</p>
            </div>
            <div className={styles.buttonsWrapper}>
              <LinkComponent link={privacyPolicyLink} style={{ border: "none" }} />
              <div className={styles.buttons}>
                <button
                  data-cy="decline-cookies"
                  onClick={() => {
                    setConsent("rejected" as ConsentState);
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
                    setConsent("accepted" as ConsentState);
                  }}
                >
                  {configuration.accept_button_text}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

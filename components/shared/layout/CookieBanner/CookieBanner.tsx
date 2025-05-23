import React, { useContext, useEffect, useState } from "react";
import { GoogleAnalytics } from "../GoogleAnalytics";
import { GoogleTagManager } from "../GoogleTagManager";
import styles from "./CookieBanner.module.scss";
import { LinkComponent } from "../../../main/blocks/Links/Links";
import { HotJar } from "../HotJar";
import { ConsentState } from "../../../../middleware.page";
import { setCookie } from "cookies-next";
import { BannerContext } from "../../../main/layout/layout";
import { MetaPixel } from "../MetaPixel";
import { CookieBannerQueryResult } from "../../../../studio/sanity.types";

export const CookieBanner: React.FC<{
  configuration: CookieBannerQueryResult;
}> = ({ configuration }) => {
  const [bannerContext, setBannerContext] = useContext(BannerContext);
  const [tracking, setTracking] = useState(false);

  // check for plausible_ignore localstorage to disable plausible tracking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ignore = localStorage.getItem("plausible_ignore");
      if (ignore === "true") {
        setTracking(false);
      } else {
        setTracking(true);
      }
    }
  }, []);

  if (!configuration) return null;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const expiredTemplate = configuration.expired_template || "Last updated {date}";

  const setConsent = (state: ConsentState) => {
    setCookie("gieffektivt-cookies-accepted", state === "accepted" ? "true" : "false", {
      sameSite: "lax",
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    });
    setBannerContext((prev) => ({ ...prev, consentState: state }));
  };

  let privacyPolicyLink = configuration.privacy_policy_link;

  if (
    bannerContext.consentExpired &&
    bannerContext.privacyPolicyLastMajorChange &&
    configuration.privacy_policy_link
  ) {
    privacyPolicyLink = {
      ...configuration.privacy_policy_link,
      title: `${configuration.privacy_policy_link.title} ${expiredTemplate.replace(
        "{date}",
        bannerContext.privacyPolicyLastMajorChange.toLocaleDateString("no-NB"),
      )}`,
    };
  }

  return (
    <>
      {bannerContext.consentState === "accepted" && !bannerContext.consentExpired && tracking && (
        <>
          {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
          {gaMeasurementId ? <GoogleAnalytics gaMeasurementId={gaMeasurementId} /> : null}
          {hotjarId ? <HotJar hotjarId={hotjarId} /> : null}
          {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
        </>
      )}
      {bannerContext.consentState === "undecided" && (
        <div data-cy="cookiebanner-container" className={styles.container}>
          <div className={styles.content}>
            <div className={styles.description}>
              <span className={styles.title}>{configuration.title}</span>
              <p>{configuration.description}</p>
            </div>
            <div className={styles.buttonsWrapper}>
              {privacyPolicyLink && (
                <LinkComponent link={privacyPolicyLink} style={{ border: "none" }} />
              )}
              <div className={styles.buttons}>
                <button
                  data-cy="decline-cookies"
                  onClick={() => {
                    setConsent("rejected" as ConsentState);
                  }}
                  style={{
                    marginRight: "2rem",
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

import React, { useContext, useRef } from "react";
import { BannerContext } from "../../../main/layout/layout";
import { CookieBanner } from "../CookieBanner/CookieBanner";
import { GeneralBanner } from "../GeneralBanner/GeneralBanner";
import { CookieBannerQueryResult, GeneralBannerQueryResult } from "../../../../studio/sanity.types";

export const HeaderBanners: React.FC<{
  cookieBannerConfig?: CookieBannerQueryResult;
  generalBannerConfig?: GeneralBannerQueryResult;
}> = ({ cookieBannerConfig, generalBannerConfig }) => {
  const bannerContainerRef = useRef<HTMLDivElement | null>(null);
  const [bannerContext, setBannerContext] = useContext(BannerContext);

  let showGeneralBanner = false;
  if (bannerContext.consentState !== "undecided") {
    showGeneralBanner = true;
  }

  return (
    <div ref={bannerContainerRef}>
      {cookieBannerConfig && <CookieBanner configuration={cookieBannerConfig} />}
      {showGeneralBanner && generalBannerConfig && (
        <GeneralBanner configuration={generalBannerConfig} />
      )}
    </div>
  );
};

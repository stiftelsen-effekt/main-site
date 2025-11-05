import React, { useContext, useRef } from "react";
import { BannerContext } from "../../../main/layout/layout";
import { CookieBanner } from "../CookieBanner/CookieBanner";
import { GeneralBanner } from "../GeneralBanner/GeneralBanner";
import { GeneralBannerQueryResult } from "../../../../studio/sanity.types";

export const HeaderBanners: React.FC<{
  generalBannerConfig?: GeneralBannerQueryResult;
}> = ({ generalBannerConfig }) => {
  const bannerContainerRef = useRef<HTMLDivElement | null>(null);
  const [bannerContext, setBannerContext] = useContext(BannerContext);

  let showGeneralBanner = false;
  if (bannerContext.consentState !== "undecided") {
    showGeneralBanner = true;
  }

  return (
    <div ref={bannerContainerRef}>
      {showGeneralBanner && generalBannerConfig && (
        <GeneralBanner configuration={generalBannerConfig} />
      )}
    </div>
  );
};

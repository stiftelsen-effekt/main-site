import React, { useContext, useRef } from "react";
import { useElementHeight } from "../../../../hooks/useElementHeight";
import { BannerContext } from "../../../main/layout/layout";
import { CookieBanner, CookieBannerConfiguration } from "../CookieBanner/CookieBanner";
import { GeneralBanner } from "../GeneralBanner/GeneralBanner";
import { Generalbanner } from "../../../../studio/sanity.types";
import { NavLink } from "../../components/Navbar/Navbar";
import { ConsentState } from "../../../../middleware.page";

export const HeaderBanners: React.FC<{
  cookieBannerConfig: CookieBannerConfiguration;
  initialConsentState: ConsentState;
  generalBannerConfig?: Generalbanner & { link: NavLink };
}> = ({ cookieBannerConfig, generalBannerConfig }) => {
  const bannerContainerRef = useRef<HTMLDivElement | null>(null);
  const [bannerContext, setBannerContext] = useContext(BannerContext);
  useElementHeight(bannerContainerRef, (height) => {
    if (Math.round(bannerContext.layoutPaddingTop) !== Math.round(height)) {
      setBannerContext((prev) => ({ ...prev, layoutPaddingTop: height }));
    }
  });

  let showGeneralBanner = false;
  if (bannerContext.consentState !== "undecided") {
    showGeneralBanner = true;
  }

  return (
    <div ref={bannerContainerRef}>
      <CookieBanner configuration={cookieBannerConfig} />
      {showGeneralBanner && generalBannerConfig && (
        <GeneralBanner configuration={generalBannerConfig} />
      )}
    </div>
  );
};

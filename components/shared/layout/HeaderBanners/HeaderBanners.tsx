import React, { useContext, useRef } from "react";
import { useElementHeight } from "../../../../hooks/useElementHeight";
import { LayoutPaddingTop } from "../../../main/layout/layout";
import { CookieBanner, CookieBannerConfiguration } from "../CookieBanner/CookieBanner";
import { GeneralBanner } from "../GeneralBanner/GeneralBanner";
import { Generalbanner } from "../../../../studio/sanity.types";
import { NavLink } from "../../components/Navbar/Navbar";
import { ConsentState } from "../../../../middleware.page";

export const HeaderBanners: React.FC<{
  cookieBannerConfig: CookieBannerConfiguration;
  initialConsentState: ConsentState;
  generalBannerConfig?: Generalbanner & { link: NavLink };
}> = ({ cookieBannerConfig, initialConsentState, generalBannerConfig }) => {
  const bannerContainerRef = useRef<HTMLDivElement | null>(null);
  const [layoutPaddingTop, setLayoutPaddingTop] = useContext(LayoutPaddingTop);
  useElementHeight(bannerContainerRef, (height) => {
    if (Math.round(layoutPaddingTop) !== Math.round(height)) {
      setLayoutPaddingTop(height);
    }
  });

  return (
    <div ref={bannerContainerRef}>
      <CookieBanner configuration={cookieBannerConfig} initialConsentState={initialConsentState} />
      {generalBannerConfig && <GeneralBanner configuration={generalBannerConfig} />}
    </div>
  );
};

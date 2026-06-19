import React from "react";
import { CookieBanner } from "./CookieBanner";
import { CookieBannerQueryResult } from "../../../../studio/sanity.types";

export const CookieBannerWrapper: React.FC<{
  cookieBannerConfig?: CookieBannerQueryResult;
}> = ({ cookieBannerConfig }) => {
  if (!cookieBannerConfig) return null;
  return <CookieBanner configuration={cookieBannerConfig} />;
};
export default CookieBannerWrapper;

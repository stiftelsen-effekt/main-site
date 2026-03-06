import { useRouter } from "next/router";
import React, { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import styles from "./Header.module.scss";
import { GeneralBanner } from "../GeneralBanner/GeneralBanner";
import { GeneralBannerQueryResult } from "../../../../studio/sanity.types";
import { BannerContext } from "../../../main/layout/layout";

const LOCAL_DEV_GENERAL_BANNER: Exclude<GeneralBannerQueryResult, null> = {
  _id: "local-dev-general-banner",
  _type: "generalbanner",
  _createdAt: "2026-03-06T00:00:00.000Z",
  _updatedAt: "2026-03-06T00:00:00.000Z",
  _rev: "local-dev-general-banner",
  title: "Test the general banner locally",
  link: {
    _key: "id_general_banner_link",
    _type: "navitem",
    title: "Var metode",
    slug: "/var-metode",
    pagetype: "generic_page",
  },
};

export const MainHeader: React.FC<{
  children: ReactNode | ReactNode[];
  hideOnScroll: boolean;
  generalBannerConfig?: GeneralBannerQueryResult;
  alwaysShrink?: boolean;
}> = ({ children, hideOnScroll, generalBannerConfig, alwaysShrink }) => {
  const router = useRouter();
  const [bannerContext] = useContext(BannerContext);

  const [navbarShrinked, setNavbarShrinked] = useState(alwaysShrink ?? false);
  const [navBarVisible, setNavBarVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const navBarCheck = useCallback(() => {
    if (typeof window !== "undefined" && !alwaysShrink) {
      if (window.scrollY > 0) setNavbarShrinked(true);
      else setNavbarShrinked(false);
    }
  }, [setNavbarShrinked, alwaysShrink]);

  const navBarVisibleCheck = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollPosition && window.scrollY > 160) {
        setNavBarVisible(false);
      } else if (window.scrollY < lastScrollPosition - 300 || window.scrollY <= 160) {
        setNavBarVisible(true);
      }
    }
  }, [lastScrollPosition, setNavBarVisible]);

  const debounced = useDebouncedCallback(
    () => {
      navBarCheck();
      if (hideOnScroll) navBarVisibleCheck();
      setLastScrollPosition(window.scrollY);
    },
    250,
    { maxWait: 250 },
  );
  useEffect(navBarCheck, [router.query.sluq, navBarCheck]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", debounced);
    }
  });

  const containerClasses = [styles.container];
  if (navbarShrinked) containerClasses.push(styles.navbarShrinked);

  const headerStackClasses = [styles.headerStack];
  if (!navBarVisible) headerStackClasses.push(styles.headerHidden);
  const effectiveGeneralBannerConfig =
    process.env.NODE_ENV === "development"
      ? generalBannerConfig ?? LOCAL_DEV_GENERAL_BANNER
      : generalBannerConfig;
  const showGeneralBanner =
    Boolean(effectiveGeneralBannerConfig) && !bannerContext.generalBannerDismissed;
  const wrapperClasses = [styles.wrapper];
  if (showGeneralBanner) wrapperClasses.push(styles.hasGeneralBanner);
  const spacerClasses = [styles.spacer];
  if (showGeneralBanner) spacerClasses.push(styles.hasGeneralBanner);

  return (
    <div className={wrapperClasses.join(" ")}>
      <div aria-hidden="true" className={spacerClasses.join(" ")} />
      <div data-cy="header" className={containerClasses.join(" ")}>
        <div className={headerStackClasses.join(" ")}>
          {showGeneralBanner && effectiveGeneralBannerConfig && (
            <GeneralBanner configuration={effectiveGeneralBannerConfig} />
          )}
          <div data-cy="header-navbar" className={styles.navbarWrapper}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

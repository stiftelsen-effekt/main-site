import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import styles from "./Header.module.scss";
import { GeneralBanner } from "../GeneralBanner/GeneralBanner";
import { GeneralBannerQueryResult } from "../../../../studio/sanity.types";
import { BannerContext } from "../../../main/layout/layout";

// Notify at most every 250ms while scrolling, matching the debounced scroll handler below
const subscribeToScroll = (onChange: () => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const handleScroll = () => {
    if (timeoutId !== undefined) return;
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      onChange();
    }, 250);
  };

  window.addEventListener("scroll", handleScroll);
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener("scroll", handleScroll);
  };
};
const getIsScrolled = () => window.scrollY > 0;
const getServerIsScrolled = () => false;

export const MainHeader: React.FC<{
  children: ReactNode | ReactNode[];
  hideOnScroll: boolean;
  generalBannerConfig?: GeneralBannerQueryResult;
  alwaysShrink?: boolean;
}> = ({ children, hideOnScroll, generalBannerConfig, alwaysShrink }) => {
  const [bannerContext] = useContext(BannerContext);

  const isScrolled = useSyncExternalStore(subscribeToScroll, getIsScrolled, getServerIsScrolled);
  const navbarShrinked = alwaysShrink || isScrolled;
  const [navBarVisible, setNavBarVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

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
      if (hideOnScroll) navBarVisibleCheck();
      setLastScrollPosition(window.scrollY);
    },
    250,
    { maxWait: 250 },
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", debounced);
    }
  });

  const containerClasses = [styles.container];
  if (navbarShrinked) containerClasses.push(styles.navbarShrinked);

  const headerStackClasses = [styles.headerStack];
  if (!navBarVisible) headerStackClasses.push(styles.headerHidden);
  const showGeneralBanner = Boolean(generalBannerConfig) && !bannerContext.generalBannerDismissed;
  const wrapperClasses = [styles.wrapper];
  if (showGeneralBanner) wrapperClasses.push(styles.hasGeneralBanner);
  const spacerClasses = [styles.spacer];
  if (showGeneralBanner) spacerClasses.push(styles.hasGeneralBanner);
  if (alwaysShrink) spacerClasses.push(styles.alwaysShrink);

  return (
    <div className={wrapperClasses.join(" ")}>
      <div aria-hidden="true" data-cy="header-spacer" className={spacerClasses.join(" ")} />
      <div data-cy="header" className={containerClasses.join(" ")}>
        <div className={headerStackClasses.join(" ")}>
          {showGeneralBanner && generalBannerConfig && (
            <GeneralBanner configuration={generalBannerConfig} />
          )}
          <div data-cy="header-navbar" className={styles.navbarWrapper}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useRouter } from "next/router";
import React, { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CookiesAccepted } from "../../../main/layout/layout";
import styles from "./Header.module.scss";

export const MainHeader: React.FC<{ children: ReactNode | ReactNode[]; hideOnScroll: boolean }> = ({
  children,
  hideOnScroll,
}) => {
  const router = useRouter();

  const [navbarShrinked, setNavbarShrinked] = useState(false);
  const [navBarVisible, setNavBarVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [cookiesAccepted, setCookiesAccepted] = useContext(CookiesAccepted);

  const navBarCheck = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > 0) setNavbarShrinked(true);
      else if(!cookiesAccepted) setNavbarShrinked(false);
      else setNavbarShrinked(true)
    }
  }, [setNavbarShrinked]);

  const navBarVisibleCheck = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollPosition && window.scrollY > 160) {
        setNavBarVisible(false);
      } else if (window.scrollY == lastScrollPosition) {
      } else {
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

  const classes = [styles.container];
  if (navbarShrinked) classes.push(styles.navbarShrinked);
  if (!navBarVisible) classes.push(styles.navbarHidden);

  return <div data-cy="header" className={classes.join(" ")}>{children}</div>;
};

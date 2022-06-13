import { useRouter } from "next/router";
import React, { Children, ReactNode, useCallback, useEffect, useState } from "react";
import styles from "../../styles/Header.module.css";

export const MainHeader: React.FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  const router = useRouter();

  const [navbarShrinked, setNavbarShrinked] = useState(false);

  const navBarCheck = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > 0) setNavbarShrinked(true);
      else setNavbarShrinked(false);
    }
  }, [setNavbarShrinked]);

  useEffect(() => {
    setInterval(navBarCheck, 100);
  }, [navBarCheck]);
  useEffect(navBarCheck, [router.query.sluq, navBarCheck]);

  const classes = [styles.container];
  if (navbarShrinked) classes.push(styles.navbarShrinked);

  return <div className={classes.join(" ")}>{children}</div>;
};

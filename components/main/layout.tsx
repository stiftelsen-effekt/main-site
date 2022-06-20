import React, { createContext, useState } from "react";
import Footer from "../footer";
import styles from "../../styles/Layout.module.css";
import { LayoutElement } from "../../types";
import { GiButton } from "../give-now-button/gi-button";
import { WidgetPane } from "../elements/widgetpane";

export const WidgetContext = createContext<[boolean, any]>([false, () => {}]);
export const CookiesAccepted = createContext<[boolean, any]>([false, () => {}]);

export const Layout: LayoutElement = ({ children, footerData }) => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  if (widgetOpen && window.innerWidth < 1180) {
    document.body.style.overflow = "hidden";
  } else if (typeof document !== "undefined") {
    document.body.style.overflow = "auto";
  }

  const containerClasses = [styles.container];
  if (!cookiesAccepted) containerClasses.push(styles.containerCookieBanner);

  return (
    <div className={containerClasses.join(" ")}>
      <GiButton inverted={false} onClick={() => setWidgetOpen(true)} />
      <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
        <CookiesAccepted.Provider value={[cookiesAccepted, setCookiesAccepted]}>
          <WidgetPane />
          <main className={styles.main}>{children}</main>
        </CookiesAccepted.Provider>
      </WidgetContext.Provider>
      <Footer {...footerData} />
    </div>
  );
};

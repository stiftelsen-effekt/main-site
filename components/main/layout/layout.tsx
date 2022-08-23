import React, { createContext, useState } from "react";
import { LayoutElement } from "../../../types";
import Footer from "../../shared/layout/Footer/Footer";
import styles from "../../shared/layout/Layout/Layout.module.scss";
import { GiveButton } from "./GiveButton/GiveButton";
import { WidgetPane } from "./WidgetPane/WidgetPane";

export const WidgetContext = createContext<[boolean, any]>([false, () => {}]);
export const CookiesAccepted = createContext<[boolean, any]>([false, () => {}]);

export const Layout: LayoutElement = ({ children, footerData, widgetData }) => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  // Set true as default to prevent flashing on first render
  const [cookiesAccepted, setCookiesAccepted] = useState(true);

  if (widgetOpen && window.innerWidth < 1180) {
    document.body.style.overflow = "hidden";
  } else if (typeof document !== "undefined") {
    document.body.style.overflow = "auto";
  }

  const containerClasses = [styles.container];
  if (!cookiesAccepted) containerClasses.push(styles.containerCookieBanner);

  return (
    <div className={containerClasses.join(" ")}>
      <GiveButton inverted={false} onClick={() => setWidgetOpen(true)} />
      <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
        <CookiesAccepted.Provider value={[cookiesAccepted, setCookiesAccepted]}>
          <WidgetPane text={widgetData} />
          <main className={styles.main}>{children}</main>
        </CookiesAccepted.Provider>
      </WidgetContext.Provider>
      <Footer {...footerData} />
    </div>
  );
};

export const widgetQuery = `
  "widget": *[_type == "donationwidget"] {
    ...
  },
`;

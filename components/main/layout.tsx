import React, { createContext, useState } from "react";
import Footer from "../footer";
import styles from "../../styles/Layout.module.css";
import { LayoutElement } from "../../types";
import { GiButton } from "../give-now-button/gi-button";
import { WidgetPane } from "../elements/widgetpane";

export const WidgetContext = createContext<[boolean, any]>([false, () => {}]);

export const Layout: LayoutElement = ({ children, footerData }) => {
  const [widgetOpen, setWidgetOpen] = useState(false);

  if (widgetOpen && window.innerWidth < 900) {
    document.body.style.overflow = "hidden";
  } else if (typeof document !== "undefined") {
    document.body.style.overflow = "auto";
  }

  return (
    <div className={`${styles.container}`}>
      <GiButton inverted={false} onClick={() => setWidgetOpen(true)} />
      <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
        <WidgetPane />
        <main className={styles.main}>{children}</main>
      </WidgetContext.Provider>
      <Footer {...footerData} />
    </div>
  );
};

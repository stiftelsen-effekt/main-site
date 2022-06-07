import React, { createContext, useState } from "react";
import { Footer } from "../footer";
import styles from "../../styles/Layout.module.css";
import { LayoutElement } from "../../types";
import { GiButton } from "../give-now-button/gi-button";
import { WidgetPane } from "../elements/widgetpane";

export const WidgetContext = createContext<[boolean, any]>([false, () => {}]);

export const Layout: LayoutElement = ({ children }) => {
  const [widgetOpen, setWidgetOpen] = useState(false);

  if (widgetOpen && window.innerWidth < 900) {
    document.documentElement.style.overflow = "hidden";
  } else if (typeof document !== "undefined") {
    document.documentElement.style.overflow = "auto";
  }

  return (
    <div className={`${styles.container}`}>
      <GiButton inverted={false} onClick={() => setWidgetOpen(true)} />
      <WidgetPane open={widgetOpen} onClose={() => setWidgetOpen(false)} />
      <WidgetContext.Provider value={[widgetOpen, setWidgetOpen]}>
        <main className={styles.main}>{children}</main>
      </WidgetContext.Provider>
      <Footer />
    </div>
  );
};

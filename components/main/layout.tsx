import React, { useState } from "react";
import { Footer } from "../footer";
import styles from "../../styles/Layout.module.css";
import { LayoutElement } from "../../types";
import { GiButton } from "../give-now-button/gi-button";
import { WidgetPane } from "../elements/widgetpane";
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
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

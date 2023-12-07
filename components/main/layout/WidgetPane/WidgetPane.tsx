import dynamic from "next/dynamic";
import React, { ComponentProps, useContext, useEffect, useState } from "react";
import type { Widget as WidgetType } from "../../../shared/components/Widget/components/Widget";
import { WidgetContext } from "../layout";
import styles from "./WidgetPane.module.scss";

const Widget = dynamic<Props>(
  () => import("../../../shared/components/Widget/components/Widget").then((mod) => mod.Widget),
  {
    ssr: false,
  },
);

interface Props extends ComponentProps<typeof WidgetType> {
  darkMode?: boolean;
}

export const WidgetPane: React.FC<Props> = ({ darkMode, ...widgetProps }) => {
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  // On initial load, have no animation
  // Then reset on render
  // This is to prevent jancky initial page load where the pane flies over the screen
  const [paneStyle, setPaneStyle] = useState<any>({ transition: "none" });
  const [widgetOpenClass, setWidgetOpenClass] = useState<string | "">("");
  useEffect(() => setPaneStyle({ display: "block" }), []);

  useEffect(() => {
    let timeoutId: any;
    if (widgetOpen) {
      setPaneStyle({ display: "block" });
      timeoutId = setTimeout(() => {
        setWidgetOpenClass(styles.widgetPaneOpen);
      }, 10);
    } else {
      setWidgetOpenClass("");
      timeoutId = setTimeout(() => {
        setPaneStyle({ display: "none" });
      }, 200);
    }

    return () => clearTimeout(timeoutId);
  }, [widgetOpen]);

  return (
    <aside
      data-cy="widget-pane"
      className={`${styles.widgetPane} ${widgetOpenClass}`}
      style={paneStyle}
    >
      <div className={styles.widgetPaneHeader}></div>
      <div className={darkMode ? styles.widgetPaneContentDark : styles.widgetPaneContent}>
        <Widget {...widgetProps} />
      </div>
    </aside>
  );
};

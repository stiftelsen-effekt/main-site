import dynamic from "next/dynamic";
import React, { ComponentProps, useContext, useEffect, useState } from "react";
import type { Widget as WidgetType } from "../../../shared/components/Widget/components/Widget";
import { WidgetContext } from "../layout";
import styles from "./WidgetPane.module.scss";

const Widget = dynamic<WidgetPaneProps>(
  () => import("../../../shared/components/Widget/components/Widget").then((mod) => mod.Widget),
  {
    ssr: false,
  },
);

export type PrefilledDistribution = {
  causeAreaId: number;
  share: number;
  organizations: { organizationId: number; share: number }[];
}[];

export interface WidgetPaneProps extends ComponentProps<typeof WidgetType> {
  darkMode?: boolean;
  prefilled: PrefilledDistribution | null;
  prefilledSum: number | null;
}

export const WidgetPane: React.FC<WidgetPaneProps> = ({ darkMode, ...widgetProps }) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  // On initial load, have no animation
  // Then reset on render
  // This is to prevent jancky initial page load where the pane flies over the screen
  const [paneStyle, setPaneStyle] = useState<any>({ transition: "none" });
  const [widgetOpenClass, setWidgetOpenClass] = useState<string | "">("");
  useEffect(() => setPaneStyle({ display: "block" }), []);

  useEffect(() => {
    let timeoutId: any;
    if (widgetContext.open) {
      setPaneStyle({ display: "block" });
      timeoutId = setTimeout(() => {
        setWidgetOpenClass(styles.widgetPaneOpen);
      }, 20);
    } else {
      setWidgetOpenClass("");
      timeoutId = setTimeout(() => {
        setPaneStyle({ display: "none" });
      }, 200);
    }

    return () => clearTimeout(timeoutId);
  }, [widgetContext]);

  const useDarkmode = darkMode || widgetProps.data.result.color_scheme === "light";

  return (
    <aside
      data-cy="widget-pane"
      className={`${styles.widgetPane} ${widgetOpenClass} ${useDarkmode ? styles.dark : ""}`}
      style={paneStyle}
    >
      <div className={styles.widgetPaneHeader}></div>
      <div className={styles.widgetPaneContent}>
        <Widget {...widgetProps} />
      </div>
    </aside>
  );
};

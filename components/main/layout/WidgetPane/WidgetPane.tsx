import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { WidgetProps } from "../../../shared/components/Widget/types/WidgetProps";
import { WidgetContext } from "../layout";
import styles from "./WidgetPane.module.scss";

const Widget = dynamic<Props>(
  () => import("../../../shared/components/Widget/components/Widget").then((mod) => mod.Widget),
  {
    ssr: false,
  },
);

interface Props {
  darkMode?: boolean;
  text: WidgetProps;
}

export const WidgetPane: React.FC<Props> = ({ darkMode, text }) => {
  const followThreshold = 20;
  const closeThreshold = 140;
  const [initialY, setInitialY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  // On initial load, have no animation
  // Then reset on render
  // This is to prevent jancky initial page load where the pane flies over the screen
  const [paneStyle, setPaneStyle] = useState<any>({ transition: "none" });
  const [widgetOpenClass, setWidgetOpenClass] = useState<string | "">("");
  useEffect(() => setPaneStyle({ display: "block" }), []);

  useEffect(() => {
    if (widgetOpen) {
      setPaneStyle({ display: "block" });
      setTimeout(() => {
        setWidgetOpenClass(styles.widgetPaneOpen);
      }, 10);
    } else {
      setWidgetOpenClass("");
      setTimeout(() => {
        setPaneStyle({ display: "none" });
      }, 200);
    }
  }, [widgetOpen]);

  const delta = currentY - initialY;

  if (widgetOpen && dragging)
    setPaneStyle({
      transform: `translateY(${Math.max(delta - followThreshold, 0)}px)`,
      transition: "none",
    });

  return (
    <aside
      data-cy="widget-pane"
      className={`${styles.widgetPane} ${widgetOpenClass}`}
      style={paneStyle}
    >
      <div
        className={styles.widgetPaneHeader}
        onTouchStart={(e) => {
          setInitialY(e.touches[0].clientY);
          setCurrentY(e.touches[0].clientY);
          setDragging(true);
        }}
        onTouchMove={(e) => {
          setCurrentY(e.touches[0].clientY);
          return false;
        }}
        onTouchEnd={(e) => {
          setDragging(false);
          if (delta > closeThreshold) {
            setWidgetOpen(false);
          }
          setInitialY(0);
          setCurrentY(0);
        }}
      ></div>
      <div className={darkMode ? styles.widgetPaneContentDark : styles.widgetPaneContent}>
        <Widget text={text} />
      </div>
    </aside>
  );
};

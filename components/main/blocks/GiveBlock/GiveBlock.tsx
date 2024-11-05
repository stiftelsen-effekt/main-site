import React, { useContext } from "react";
import styles from "./GiveBlock.module.scss";
import { WidgetContext } from "../../layout/layout";
import { CSSProperties } from "styled-components";

type GiveBlockProps = {
  heading: string;
  paragraph: string;
  donateLabel: string;
  accentColor?: string;
};

export const GiveBlock: React.FC<GiveBlockProps> = ({
  heading,
  paragraph,
  donateLabel,
  accentColor,
}) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  let accentStyles: CSSProperties = {};
  if (accentColor) {
    accentStyles = {
      backgroundColor: accentColor,
      color: "white",
      border: "none",
    };
  }

  return (
    <div className={styles.container}>
      <h3>{heading}</h3>
      <p className="inngress">{paragraph}</p>
      <button
        className={styles.button}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.blur();
          setWidgetContext({ open: true, prefilled: null, prefilledSum: null });
        }}
        style={accentStyles}
      >
        {donateLabel || "Gi."}
      </button>
    </div>
  );
};

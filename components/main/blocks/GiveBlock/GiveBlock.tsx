import React, { useContext } from "react";
import styles from "./GiveBlock.module.scss";
import { WidgetContext } from "../../layout/layout";
import { CSSProperties } from "styled-components";
import { usePlausible } from "next-plausible";

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
  const plausible = usePlausible();

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
          plausible("OpenDonationWidget", {
            props: {
              page: window.location.pathname,
            },
          });
          plausible("OpenDonationWidgetGiveBlockCTA", {
            props: {
              page: window.location.pathname,
            },
          });
          setWidgetContext({ open: true, prefilled: null, prefilledSum: null });
        }}
        style={accentStyles}
      >
        {donateLabel || "Giv."}
      </button>
    </div>
  );
};

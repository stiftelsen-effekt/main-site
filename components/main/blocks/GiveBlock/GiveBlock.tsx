import React, { useContext } from "react";
import styles from "./GiveBlock.module.scss";
import { WidgetContext } from "../../layout/layout";

type GiveBlockProps = {
  heading: string;
  paragraph: string;
};

export const GiveBlock: React.FC<GiveBlockProps> = ({ heading, paragraph }) => {
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  return (
    <div className={styles.container}>
      <h3>{heading}</h3>
      <p className="inngress">{paragraph}</p>
      <button
        className={styles.button}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.blur();
          setWidgetOpen(true);
        }}
      >
        Gi.
      </button>
    </div>
  );
};

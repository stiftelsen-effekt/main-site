import React, { useContext } from "react";
import styles from "./GiveBlock.module.scss";
import { WidgetContext } from "../../layout/layout";

export const GiveBlock: React.FC = () => {
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  return (
    <div className={styles.container}>
      <h3>Maksimer effekten av det du gir.</h3>
      <p className="inngress">Bruk Gi Effektivt.</p>
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

import React, { useContext } from "react";
import styles from "../../styles/GiveBlock.module.css";
import { WidgetContext } from "../main/layout";

export const GiveBlock: React.FC = () => {
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  return (
    <div className={styles.container}>
      <h2>Maksimer effekten av det du gir.</h2>
      <span>Bruk Gi Effektivt.</span>
      <button className={styles.button} onClick={() => setWidgetOpen(true)}>
        Gi.
      </button>
    </div>
  );
};

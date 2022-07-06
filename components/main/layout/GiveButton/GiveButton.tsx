import React from "react";
import styles from "./GiveButton.module.scss";

export const GiveButton: React.FC<{ inverted: boolean; onClick: () => void }> = ({
  inverted,
  onClick,
}) => {
  return (
    <button
      className={`${styles.givebutton} ${inverted ? styles.givebuttoninverted : null}`}
      title="Trykk for å åpne donasjonspanelet"
      onClick={onClick}
      data-cy="gi-button"
    >
      Gi.
    </button>
  );
};

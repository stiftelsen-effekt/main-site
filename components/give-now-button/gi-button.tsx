import React from "react";
import styles from "../../styles/GiButton.module.css";

export const GiButton: React.FC<{ inverted: boolean; onClick: () => void }> = ({
  inverted,
  onClick,
}) => {
  return (
    <button
      className={`${styles.gibutton} ${inverted ? styles.gibuttoninverted : null}`}
      title="Trykk for å åpne donasjonspanelet"
      onClick={onClick}
    >
      Doner.
    </button>
  );
};

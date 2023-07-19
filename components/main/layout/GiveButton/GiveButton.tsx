import React from "react";
import styles from "./GiveButton.module.scss";
import { usePlausible } from "next-plausible";

export const GiveButton: React.FC<{ inverted: boolean; onClick: () => void }> = ({
  inverted,
  onClick,
}) => {
  const plausible = usePlausible();

  const handleClick = () => {
    plausible("OpenDonationWidget", {
      props: {
        page: window.location.pathname,
      },
    });
    onClick();
  };

  return (
    <button
      className={`${styles.givebutton} ${inverted ? styles.givebuttoninverted : null}`}
      title="Trykk for å åpne donasjonspanelet"
      onClick={handleClick}
      data-cy="gi-button"
    >
      Gi.
    </button>
  );
};

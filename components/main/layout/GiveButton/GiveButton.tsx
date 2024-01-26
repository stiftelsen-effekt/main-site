import React, { PropsWithChildren } from "react";
import styles from "./GiveButton.module.scss";
import { usePlausible } from "next-plausible";

export const GiveButton: React.FC<
  PropsWithChildren<{ color: string; inverted: boolean; onClick: () => void }>
> = ({ children, color, inverted, onClick }) => {
  const plausible = usePlausible();

  const handleClick = () => {
    plausible("OpenDonationWidget", {
      props: {
        page: window.location.pathname,
      },
    });
    onClick();
  };

  let customStyles = {};
  if (color) {
    customStyles = {
      backgroundColor: color,
      color: "white",
      border: "none",
    };
  }

  return (
    <button
      style={customStyles}
      className={`${styles.givebutton} ${inverted ? styles.givebuttoninverted : null}`}
      title="Trykk for å åpne donasjonspanelet"
      onClick={handleClick}
      data-cy="gi-button"
    >
      {children}
    </button>
  );
};

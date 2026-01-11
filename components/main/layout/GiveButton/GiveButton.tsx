import React, { PropsWithChildren } from "react";
import styles from "./GiveButton.module.scss";
import { usePlausible } from "next-plausible";

export const GiveButton: React.FC<
  PropsWithChildren<{ color: string; inverted: boolean; onClick: () => void; title: string }>
> = ({ children, color, inverted, title, onClick }) => {
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
      "--accent-color": color,
    } as React.CSSProperties;
  }

  return (
    <button
      style={customStyles}
      className={`${styles.givebutton} ${inverted ? styles.givebuttoninverted : ""}`}
      title={title}
      onClick={handleClick}
      data-cy="gi-button"
    >
      {children}
    </button>
  );
};

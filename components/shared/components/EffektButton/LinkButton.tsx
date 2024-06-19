import React from "react";
import styles from "./EffektButton.module.scss";
import Link from "next/link";

type ButtonType = "primary" | "secondary" | "tertiary";

const LinkButton: React.FC<{
  url: string;
  title: string;
  type?: ButtonType;
  squared?: boolean;
  target?: string;
}> = ({ url, title, type = "primary", squared, target }) => {
  return (
    <Link
      href={url}
      target={target}
      passHref
      className={`${styles.button} ${
        type == "primary"
          ? styles.buttonprimary
          : type == "secondary"
          ? styles.buttonsecondary
          : type == "tertiary"
          ? styles.buttontertiary
          : styles.buttonprimary
      } ${squared ? styles.button__squared : null}`}
    >
      {`${title}`}
    </Link>
  );
};

export default LinkButton;

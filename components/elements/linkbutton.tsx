import React from "react";
import elements from "../../styles/Elements.module.css";
import Link from "next/link";

type ButtonType = "primary" | "secondary" | "tertiary";

const LinkButton: React.FC<{
  url: string;
  title: string;
  type?: ButtonType;
  squared?: boolean;
}> = ({ url, title, type = "primary", squared }) => {
  return (
    <Link href={url} passHref>
      <a
        className={`${elements.button} ${
          type == "primary"
            ? elements.buttonprimary
            : type == "secondary"
            ? elements.buttonsecondary
            : type == "tertiary"
            ? elements.buttontertiary
            : elements.buttonprimary
        } ${squared ? elements.button__squared : null}`}
      >{`${title}`}</a>
    </Link>
  );
};

export default LinkButton;

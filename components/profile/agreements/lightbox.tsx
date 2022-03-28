import React, { HtmlHTMLAttributes, useState } from "react";
import style from "../../../styles/Lightbox.module.css";

export type Children = {
  button: string;
  heading: string;
  paragraph: string[];
};

export const Lightbox: React.FC<{ children: Children }> = (children) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const cancelAgreement = () => {
    console.log("deleted");
    toggleIsOpen();
  };

  return (
    <div>
      <div onClick={toggleIsOpen}>{children.children.button}</div>
      {isOpen ? (
        <div className={style.lightbox}>
          <h2>{children.children.heading}</h2>
          {children.children.paragraph.map((string) => {
            return <p>{string}</p>;
          })}
          <button className={style.button + " " + style.button1}>
            Bekreft
          </button>
          <button
            className={style.button + " " + style.button2}
            onClick={cancelAgreement}
          >
            Avbryt
          </button>
        </div>
      ) : null}
    </div>
  );
};

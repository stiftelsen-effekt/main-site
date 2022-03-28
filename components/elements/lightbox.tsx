import React, { HtmlHTMLAttributes, useState } from "react";
import style from "../../styles/Lightbox.module.css";

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
        <div className={style.lightboxWrapper}>
          <div className={style.lightbox}>
            <h2>{children.children.heading}</h2>
            {children.children.paragraph.map((string, i) => {
              return <p key={i}>{string}</p>;
            })}
            <div className={style.buttonWrapper}>
              <button className={style.button}>Bekreft</button>
              <button className={style.button} onClick={cancelAgreement}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

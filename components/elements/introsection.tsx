import React from "react";
import { EffektButton } from "./effektbutton";
import elements from "../../styles/Elements.module.css";

export const IntroSection: React.FC<{ heading: string; paragraph: string; slug: string }> = ({
  heading,
  paragraph,
  slug,
}) => {
  return (
    <div className={elements.introsection}>
      <div>
        <h2>{heading}</h2>
      </div>
      <div>
        <p>{paragraph}</p>
        {/*<EffektButton onClick={() => {}}>Les mer</EffektButton>*/}
      </div>
    </div>
  );
};

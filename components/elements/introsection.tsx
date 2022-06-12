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
        <h3>{heading}</h3>
      </div>
      <div>
        <p>{paragraph}</p>
        {/*<EffektButton onClick={() => {}}>Les mer</EffektButton>*/}
      </div>
    </div>
  );
};

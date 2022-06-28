import React from "react";
import elements from "./IntroSection.module.scss";

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
      </div>
    </div>
  );
};

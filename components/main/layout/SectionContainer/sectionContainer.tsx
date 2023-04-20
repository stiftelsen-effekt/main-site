import React from "react";
import styles from "./SectionContainer.module.scss";

export type SectionContainerProps = {
  heading?: string;
  inverted?: boolean;
  nodivider?: boolean;
  padded?: boolean;
};

export const SectionContainer: React.FC<SectionContainerProps> = ({
  heading,
  inverted,
  nodivider,
  padded,
  children,
}) => {
  const containerClasses = [styles.section__container, inverted ? styles.inverted : ""];
  const headingClasses = [styles.section__heading, nodivider ? "" : styles.divider];
  const contentClasses = [styles.section__content, padded ? styles.padded : ""];

  return (
    <section className={containerClasses.join(" ")}>
      <span className={headingClasses.join(" ")} style={heading ? {} : { paddingTop: "0px" }}>
        {heading}
      </span>
      <div className={contentClasses.join(" ")}>{children}</div>
    </section>
  );
};

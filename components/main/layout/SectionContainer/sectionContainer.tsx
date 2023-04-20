import React from "react";
import styles from "./SectionContainer.module.scss";

export type SectionContainerProps = {
  heading?: string;
  inverted?: boolean;
  nodivider?: boolean;
  padded?: boolean;
  ypadded?: boolean;
};

export const SectionContainer: React.FC<SectionContainerProps> = ({
  heading,
  inverted,
  nodivider,
  padded,
  ypadded = true,
  children,
}) => {
  const containerClasses = [styles.section__container, inverted ? styles.inverted : ""];
  const headingClasses = [styles.section__heading, nodivider ? "" : styles.divider];
  const contentClasses = [
    styles.section__content,
    padded ? styles.padded : "",
    ypadded ? styles.ypadded : "",
  ];

  return (
    <section className={containerClasses.join(" ")}>
      <span className={headingClasses.join(" ")}>{heading}</span>
      <div className={contentClasses.join(" ")}>{children}</div>
    </section>
  );
};

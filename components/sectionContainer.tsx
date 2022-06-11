import React from "react";
import styles from "../styles/SectionContainer.module.css";

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
  let background;
  let dividerLine = styles.divider;
  let paddedClass;

  inverted ? (background = styles.inverted) : null;
  nodivider ? (dividerLine = "") : null;
  padded ? (paddedClass = styles.padded) : null;

  return (
    <section className={styles.section__container + " " + background}>
      <h2 className={styles.section__heading + " " + dividerLine}>{heading}</h2>
      <div className={styles.section__content + " " + paddedClass}>{children}</div>
    </section>
  );
};

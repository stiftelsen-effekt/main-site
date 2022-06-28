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
  let background;
  let dividerLine = styles.divider;
  let paddedClass;

  inverted ? (background = styles.inverted) : null;
  nodivider ? (dividerLine = "") : null;
  padded ? (paddedClass = styles.padded) : null;

  return (
    <section className={styles.section__container + " " + background}>
      <span
        className={styles.section__heading + " " + dividerLine}
        style={heading ? {} : { paddingTop: "0px" }}
      >
        {heading}
      </span>
      <div className={styles.section__content + " " + paddedClass}>{children}</div>
    </section>
  );
};

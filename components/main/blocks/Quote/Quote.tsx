import React from "react";
import styles from "./Quote.module.scss";
export const Quote: React.FC<{
  quote: string;
  quotationMarks?: boolean;
  offset: "Left" | "Right" | "None";
}> = ({ quote, quotationMarks, offset }) => {
  const quoteClasses = [styles.quote];

  if (offset === "Left") quoteClasses.push(styles.offsetLeft);
  if (offset === "Right") quoteClasses.push(styles.offsetRight);

  return (
    <div className={styles.container}>
      <h5 className={quoteClasses.join(" ")}>
        {quotationMarks && "“"}
        {quote}
        {quotationMarks && "”"}
      </h5>
    </div>
  );
};

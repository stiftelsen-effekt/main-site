import React from "react";
import styles from "./HTMLEmbed.module.scss";

export const HTMLEmbed: React.FC<{
  code: string;
  grayscale?: boolean;
}> = ({ code, grayscale }) => {
  const classNames = [styles.wrapper];
  if (grayscale) classNames.push(styles.grayscale);

  return <div className={classNames.join(" ")} dangerouslySetInnerHTML={{ __html: code }}></div>;
};

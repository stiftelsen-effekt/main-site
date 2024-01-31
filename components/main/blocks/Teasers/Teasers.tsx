import React from "react";
import styles from "./Teasers.module.scss";
import { TeasersItem, TeasersItemProps } from "../TeasersItem/TeasersItem";

export const Teasers: React.FC<{ teasers: Array<TeasersItemProps & { _key: any }> }> = ({
  teasers,
}) => {
  return (
    <div className={styles.teasers}>
      {teasers.map(({ _key, title, paragraph, disclaimer, links, image }) => (
        <TeasersItem
          key={_key}
          title={title}
          paragraph={paragraph}
          disclaimer={disclaimer}
          links={links}
          image={image}
        />
      ))}
    </div>
  );
};

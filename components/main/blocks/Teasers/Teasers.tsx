import React from "react";
import styles from "./Teasers.module.scss";
import { TeasersItem, TeasersItemProps } from "../TeasersItem/TeasersItem";

export const Teasers: React.FC<{ teasers: Array<TeasersItemProps & { _key: any }> }> = ({
  teasers,
}) => {
  return (
    <div className={styles.teasers}>
      {teasers.map(({ _key, id, title, paragraph, disclaimer, links, image }, i) => (
        <TeasersItem
          key={_key}
          id={id}
          title={title}
          paragraph={paragraph}
          disclaimer={disclaimer}
          links={links}
          image={image}
          inverted={i % 2 !== 0}
        />
      ))}
    </div>
  );
};

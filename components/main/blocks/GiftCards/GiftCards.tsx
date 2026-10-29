import React from "react";
import styles from "./GiftCards.module.scss";
import { GiftCardItem, GiftCardItemProps } from "./GiftCardItem";

export const GiftCards: React.FC<{ giftcards: Array<GiftCardItemProps & { _key: any }> }> = ({
  giftcards,
}) => {
  return (
    <div className={styles.giftcards}>
      {giftcards &&
        giftcards.map(({ _key, title, price, image, links }) => (
          <GiftCardItem key={_key} title={title} price={price} image={image} links={links} />
        ))}
    </div>
  );
};

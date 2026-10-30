import React from "react";
import styles from "./GiftCards.module.scss";
import { GiftCardItem, GiftCardItemProps } from "./GiftCardItem";

export const GiftCards: React.FC<{
  giftcards: Array<Omit<GiftCardItemProps, "locale" | "currency"> & { _key: any }>;
  locale?: string | null;
  currency?: string | null;
}> = ({ giftcards, locale, currency }) => {
  return (
    <div className={styles.giftcards}>
      {giftcards &&
        giftcards.map(({ _key, title, price, image, alt, links }) => (
          <GiftCardItem
            key={_key}
            title={title}
            price={price}
            image={image}
            alt={alt}
            links={links}
            locale={locale}
            currency={currency}
          />
        ))}
    </div>
  );
};

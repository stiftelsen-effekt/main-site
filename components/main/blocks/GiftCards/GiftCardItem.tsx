import React from "react";
import styles from "./GiftCards.module.scss";
import type { SanityImageObject } from "@sanity/image-url";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType, Links } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { formatGiftCardPrice } from "./formatGiftCardPrice";

export interface GiftCardItemProps {
  title: string;
  price?: number;
  image: SanityImageObject;
  alt?: string;
  links?: (LinkType | NavLink)[];
  locale?: string | null;
  currency?: string | null;
}

export const GiftCardItem: React.FC<GiftCardItemProps> = ({
  title,
  price,
  image,
  alt,
  links,
  locale,
  currency,
}) => {
  return (
    <div className={styles.giftcarditem}>
      <div className={styles.giftcarditemimage}>
        <ResponsiveImage
          image={image}
          alt={alt || title}
          layout={"cover"}
          coverAspectRatio={1}
          sizes="(min-width: 1181px) 25vw, 90vw"
        />
      </div>
      <div className={styles.giftcarditemtext}>
        <h3>{title}</h3>
        {price != null && (
          <p className={styles.giftcarditemprice}>{formatGiftCardPrice(price, locale, currency)}</p>
        )}
      </div>
      {links && <Links links={links} buttons />}
    </div>
  );
};

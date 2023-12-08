import { useRouter } from "next/router";
import React from "react";
import styles from "./GiftCard.module.scss";
import Link from "next/link";
import Image from "next/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType, Links, LinksProps } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { PortableText } from "@portabletext/react";

export const GiftCard: React.FC<{
  title: string;
  description: any[];
  image: SanityImageSource;
  links: (LinkType | NavLink)[];
}> = ({ title, description, image, links }) => {
  const router = useRouter();

  return (
    <div className={styles.giftcard}>
      <div className={styles.giftcardimage}>
        <ResponsiveImage image={image} />
      </div>
      <div className={styles.giftcardtext}>
        <div>
          <h3>{title}</h3>
          <PortableText value={description} />
        </div>
        <Links links={links} />
      </div>
    </div>
  );
};

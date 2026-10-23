import React from "react";
import styles from "./Contributor.module.scss";
import type { SanityImageObject } from "@sanity/image-url";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export type ContributorType = {
  _id: string;
  image: SanityImageObject;
  displayImage?: boolean;
  name: string;
  first_name?: string; // Optional first name for display purposes
  email?: string;
  subrole?: string;
  additional?: string;
};

/*
 * Column width of the auto-fill grid in Contributors: minmax(240px, 1fr) with a 40px gap above
 * 1180px, minmax(160px, 1fr) with a 20px gap below, in a 90vw (max 1714px) section. One entry per
 * column count; thresholds are rounded up so the wider column is assumed at each boundary.
 */
const CONTRIBUTORS_LIST_SIZES = [
  "(min-width: 1920px) 253px",
  "(min-width: 1823px) calc(15vw - 33px)",
  "(min-width: 1512px) calc(18vw - 32px)",
  "(min-width: 1200px) calc(22.5vw - 30px)",
  "(min-width: 1181px) calc(30vw - 26px)",
  "(min-width: 1178px) calc(15vw - 16px)",
  "(min-width: 978px) calc(18vw - 16px)",
  "(min-width: 778px) calc(22.5vw - 15px)",
  "(min-width: 578px) calc(30vw - 13px)",
  "(min-width: 378px) calc(45vw - 10px)",
  "90vw",
].join(", ");

export const Contributor: React.FC<
  ContributorType & { contactLink?: boolean; locale?: string; sizes?: string }
> = ({
  image,
  displayImage = true,
  name,
  first_name,
  email,
  subrole,
  additional,
  contactLink = false,
  locale = "no", // Default locale
  sizes = CONTRIBUTORS_LIST_SIZES,
}) => {
  let contactString = "";
  if (locale === "no") {
    contactString = "Ta kontakt med";
  } else if (locale === "dk") {
    contactString = "Tag kontakt med";
  } else if (locale === "sv") {
    contactString = "Ta kontakt med";
  } else {
    contactString = "Contact ";
  }

  return (
    <div className={styles.contributor}>
      {image != null && displayImage && (
        <div className={styles.contributor__image}>
          <ResponsiveImage layout="cover" image={image} coverAspectRatio={24 / 31} sizes={sizes} />
        </div>
      )}
      <span className={styles.contributor__title}>{name}</span>
      <span className={styles.contributor__subrole + " detailheader"}>{subrole ?? ""}</span>
      <span className={styles.contributor__additional + " detailheader"}>{additional ?? ""}</span>
      {contactLink ? (
        <a href={`mailto:${email}`}>
          <span className={styles.contributor__email + " caption"}>
            → {contactString}
            <span className={styles.contributor__email_name}>
              {" "}
              {first_name ? first_name : name.split(" ")[0]}
            </span>
          </span>
        </a>
      ) : (
        <span className={styles.contributor__email + " caption"}>{email ?? ""}</span>
      )}
    </div>
  );
};

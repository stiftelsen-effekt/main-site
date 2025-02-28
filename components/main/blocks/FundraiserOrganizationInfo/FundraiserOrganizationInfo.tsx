import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import styles from "./FundraiserOrganizationInfo.module.scss";
import Link from "next/link";
import { Fragment } from "react";

export const FundraiserOrganizationInfo: React.FC<{
  name: string;
  logo: SanityImageObject;
  textTemplate: string;
  organizationSlug: string;
}> = ({ name, logo, textTemplate, organizationSlug }) => {
  const orgLink = <Link href={`/${organizationSlug}`}>{name}</Link>;

  // Split text template into parts, and add the organization name as a link
  // to the organization page. Note that there might be multiple instances of
  // the organization name in the text template.
  const parts = textTemplate.split("{org}");
  const text = parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 && orgLink}
    </Fragment>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <ResponsiveImage
          image={logo}
          alt={name}
          /* Will never be larger than 200px */
          sizes="(max-width: 200px) 100vw, 200px"
          layout="responsive"
        />
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

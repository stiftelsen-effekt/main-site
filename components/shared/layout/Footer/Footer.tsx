import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../../main/layout/navbar";
import vercelBanner from "../../../../public/vercel-banner.svg";
import styles from "./Footer.module.scss";
import { NewsletterSignup } from "../../../main/blocks/NewsletterSignup/NewsletterSignup";
import { withStaticProps } from "../../../../util/withStaticProps";
import { getClient } from "../../../../lib/sanity.server";
import { groq } from "next-sanity";

export type FooterItem = NavLink | LinkType;
export type FooterProps = {
  footer_column_1?: FooterItem[];
  footer_column_2?: FooterItem[];
  footer_column_3?: FooterItem[];
  footer_column_4?: FooterItem[];
};

type QueryResult = {
  footer: [FooterProps];
};

const query = groq`
  {
    "footer": *[_type == "site_settings"] {
      footer_column_1[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      },
      footer_column_2[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      },
      footer_column_3[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      },
      footer_column_4[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      },
    }
  }
`;

const Footer = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<QueryResult>(query);

  return {
    data: result.footer[0],
  };
})(({ data: { footer_column_1, footer_column_2, footer_column_3, footer_column_4 } }) => {
  return (
    <footer className={styles.grid} id={"footer"}>
      <div className={`${styles.category} ${styles.logo__bottom}`}>
        <figure>
          <p>G</p>
        </figure>
      </div>

      <div className={`${styles.category} ${styles.primary__links}`}>
        <ul>
          {footer_column_1 &&
            footer_column_1.map((footerItem) => {
              return (
                <li key={footerItem._key}>
                  <Link
                    href={
                      footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url || "/"
                    }
                    passHref
                  >
                    <a target={footerItem._type === "link" && footerItem.newtab ? "_blank" : ""}>
                      {footerItem.title}
                    </a>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      <div className={`${styles.category} ${styles.secondary__links}`}>
        <ul>
          {footer_column_2 &&
            footer_column_2.map((footerItem) => {
              return (
                <li key={footerItem._key}>
                  <Link
                    href={
                      footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url || "/"
                    }
                    passHref
                  >
                    <a target={footerItem._type === "link" && footerItem.newtab ? "_blank" : ""}>
                      {footerItem.title}
                    </a>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      <div className={`${styles.category} ${styles.tertiary__links}`}>
        <ul>
          {footer_column_3 &&
            footer_column_3.map((footerItem) => {
              return (
                <li key={footerItem._key}>
                  <Link
                    href={
                      footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url || "/"
                    }
                    passHref
                  >
                    <a target={footerItem._type === "link" && footerItem.newtab ? "_blank" : ""}>
                      {footerItem.title}
                    </a>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      <div className={`${styles.category} ${styles.utillity}`}>
        <ul>
          {footer_column_4 &&
            footer_column_4.map((footerItem) => {
              return (
                <li key={footerItem._key}>
                  <Link
                    href={
                      footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url || "/"
                    }
                    passHref
                  >
                    <a target={footerItem._type === "link" && footerItem.newtab ? "_blank" : ""}>
                      {footerItem.title}
                    </a>
                  </Link>
                </li>
              );
            })}
          <li>&nbsp;</li>
          <li>
            <a data-cy="navigate-to-top" href="#top">
              Til toppen &uarr;
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.newsletter}>
        <NewsletterSignup></NewsletterSignup>
      </div>
      <div className={`${styles.category} ${styles.sanity}`}>
        Structured content powered by{" "}
        <a href="https://www.sanity.io/" target="_blank" rel="noreferrer">
          Sanity.io
        </a>
        <a
          href="https://vercel.com?utm_source=effective-altruism-norway&utm_campaign=oss"
          style={{ borderBottom: "none", marginTop: "0.8rem", display: "block" }}
        >
          <Image src={vercelBanner} alt="Powered by Vercel" width={160} />
        </a>
      </div>
    </footer>
  );
});

export default Footer;

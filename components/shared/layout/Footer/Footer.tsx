import Link from "next/link";
import React from "react";
import { LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../components/Navbar/Navbar";
import styles from "./Footer.module.scss";
import { NewsletterSignup } from "../../../main/blocks/NewsletterSignup/NewsletterSignup";
import { withStaticProps } from "../../../../util/withStaticProps";
import { getClient } from "../../../../lib/sanity.server";
import { groq } from "next-sanity";

export type FooterItem = NavLink | LinkType;
export type FooterProps = {
  _key: string;
  links?: FooterItem[];
}[];

type QueryResult = {
  data: {
    _id: string;
    footer_columns?: FooterProps;
    footer_to_top_label?: string;
    footer_newsletter_heading?: string;
  }[];
};

export const footerQuery = groq`
  {
    "data": *[_type == "site_settings"] {
      _id,
      footer_columns[] {
        _key,
        links[] {
          _type == 'navitem' => @ {
            ...,
            "slug": page->slug.current
          },
          _type == 'link' => @ {
            ...
          },
        }
      },
      footer_to_top_label,
      footer_newsletter_heading,
    }
  }
`;

const Footer = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<QueryResult>(footerQuery);

  const footer = result.data[0];
  return {
    data: footer,
  };
})(({ data: { footer_columns, footer_to_top_label, footer_newsletter_heading } }) => {
  const columnCount = footer_columns ? footer_columns.filter((c) => c.links).length : 0;

  const gridClass = styles[`grid_${columnCount}`];

  return (
    <footer className={`${styles.grid} ${gridClass}`} id={"footer"}>
      <div className={`${styles.category} ${styles.logo__bottom}`}>
        <figure>
          <p>G</p>
        </figure>
      </div>
      {footer_columns &&
        footer_columns.map((column, index) => (
          <div className={`${styles.category}`} key={column._key}>
            <ul>
              {column.links &&
                column.links.map((footerItem) => {
                  return (
                    <li key={footerItem._key}>
                      <Link
                        href={
                          footerItem._type === "navitem"
                            ? `/${footerItem.slug}`
                            : footerItem.url || "/"
                        }
                        passHref
                      >
                        <a
                          target={footerItem._type === "link" && footerItem.newtab ? "_blank" : ""}
                        >
                          {footerItem.title}
                        </a>
                      </Link>
                    </li>
                  );
                })}
              {index === columnCount - 1 && (
                <>
                  <li>&nbsp;</li>
                  <li>
                    <a data-cy="navigate-to-top" href="#top">
                      {footer_to_top_label} &uarr;
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        ))}
      <div className={styles.newsletter}>
        <NewsletterSignup header={footer_newsletter_heading}></NewsletterSignup>
      </div>
      <div className={`${styles.category} ${styles.sanity}`}>
        Structured content powered by{" "}
        <a href="https://www.sanity.io/" target="_blank" rel="noreferrer">
          Sanity.io
        </a>
      </div>
    </footer>
  );
});

export default Footer;

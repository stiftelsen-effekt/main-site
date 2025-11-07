import Link from "next/link";
import React from "react";
import { LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../components/Navbar/Navbar";
import styles from "./Footer.module.scss";
import { NewsletterSignup } from "../../../main/blocks/NewsletterSignup/NewsletterSignup";
import { withStaticProps } from "../../../../util/withStaticProps";
import { getClient } from "../../../../lib/sanity.client";
import { groq } from "next-sanity";
import { token } from "../../../../token";

export type FooterItem = NavLink | LinkType;
export type FooterProps = {
  _key: string;
  links?: FooterItem[];
}[];

type QueryResult = {
  _id: string;
  footer_columns?: FooterProps;
  footer_to_top_label?: string;
  footer_newsletter_heading?: string;
  footer_newsletter_form_url?: string;
  footer_newsletter_send_label?: string;
  footer_email_label?: string;
  main_locale: string;
};

export const footerQuery = groq`
  *[_type == "site_settings"][0] {
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
    footer_newsletter_form_url,
    footer_newsletter_send_label,
    footer_email_label,
    main_locale,
  }
`;

const Footer = withStaticProps(async ({ draftMode = false }: { draftMode: boolean }) => {
  const result = await getClient(draftMode ? token : undefined).fetch<QueryResult>(footerQuery);

  return {
    data: {
      result,
      query: footerQuery,
    },
  };
})(({ data }) => {
  const {
    footer_columns,
    footer_to_top_label,
    footer_newsletter_heading,
    footer_newsletter_form_url,
    footer_newsletter_send_label,
    footer_email_label,
    main_locale,
  } = data.result;

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
                  // Determine the href, ensuring we never use undefined slugs
                  const href =
                    footerItem._type === "navitem"
                      ? footerItem.slug
                        ? `/${footerItem.slug}`
                        : null // Skip rendering if slug is undefined
                      : footerItem.url || "/";

                  // Don't render link if href is null (broken page reference)
                  if (href === null) {
                    if (process.env.NODE_ENV === "development") {
                      console.warn(
                        `Footer link "${footerItem.title}" has undefined slug. Check Sanity page reference.`,
                      );
                    }
                    return null;
                  }

                  return (
                    <li key={footerItem._key}>
                      <Link
                        href={href}
                        target={footerItem._type === "link" && footerItem.newtab ? "_blank" : ""}
                      >
                        {footerItem.title}
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
        <NewsletterSignup
          header={footer_newsletter_heading}
          formurl={footer_newsletter_form_url}
          sendlabel={footer_newsletter_send_label}
          emailLabel={footer_email_label}
          locale={main_locale}
        ></NewsletterSignup>
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

import Link from "next/link";
import React from "react";
import { LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../../main/layout/navbar";
import styles from "./Footer.module.scss";

export type FooterItem = NavLink | LinkType;
export type FooterProps = {
  footer_column_1?: FooterItem[];
  footer_column_2?: FooterItem[];
  footer_column_3?: FooterItem[];
};

export default function Footer({ footer_column_1, footer_column_2, footer_column_3 }: FooterProps) {
  return (
    <footer className={styles.grid}>
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
                    href={footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url}
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
                    href={footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url}
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
                    href={footerItem._type === "navitem" ? `/${footerItem.slug}` : footerItem.url}
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
          <li>
            {" "}
            <Link href="/personvern" passHref>
              Personvern
            </Link>
          </li>
          <li>
            {" "}
            <Link href="/vilkar" passHref>
              Vilkår
            </Link>
          </li>
          <li>&nbsp;</li>
          <li>
            <a href="#top">Til toppen &uarr;</a>
          </li>
        </ul>
      </div>
      {/* This is a modified version of mailchimps embedded subscribe-element
    see docs/mailchimp.html for the original version */}
      <form
        className={`${styles.category} ${styles.newsletter}`}
        action="https://gieffektivt.us13.list-manage.com/subscribe/post?u=b187f08a296043edd3aa56680&amp;id=4c98331f9d"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        noValidate
      >
        <fieldset>
          <label className={styles.newsletter_label} htmlFor="mce-EMAIL">
            Meld meg på nyhetsbrevet
          </label>

          <div className={styles.input__inlinebutton}>
            <input type="email" name="EMAIL" placeholder="E-POST" id="mce-EMAIL" />
            <button
              type="submit"
              name="subscribe"
              id="mc-embedded-subscribe"
              title="Send påmelding til nyhetsbrev"
            >
              SEND&nbsp;→
            </button>
          </div>
        </fieldset>
        {/* This input seems to be for making sure robots do not subscribe to our newsletter */}
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input
            type="text"
            name="b_b187f08a296043edd3aa56680_4c98331f9d"
            tabIndex={-1}
            defaultValue=""
          />
        </div>
      </form>
      <div className={`${styles.category} ${styles.sanity}`}>
        Structured content powered by{" "}
        <a href="https://www.sanity.io/" target="_blank" rel="noreferrer">
          Sanity.io
        </a>
      </div>
    </footer>
  );
}

export const footerQuery = `
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
    }
  },
`;

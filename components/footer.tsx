import Link from "next/link";
import React from "react";
import styles from "../styles/Footer.module.css";
import { MainNavbarLink } from "./main/navbar";

type FooterLink = {
  _type: "link";
  _key: string;
  title: string;
  url: string;
};

export type FooterItem = MainNavbarLink | FooterLink;
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
                  >
                    {footerItem.title}
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
                  >
                    {footerItem.title}
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
                  >
                    {footerItem.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>

      <div className={`${styles.category} ${styles.utillity}`}>
        <a href="#">Personvern</a>
        <p> &#169; 2022 Gi Effektivt</p>
        <a href="#top">Til toppen &uarr;</a>
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
          <label className={styles.newsletter__label} htmlFor="mce-EMAIL">
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
    </footer>
  );
}

export const footerQuery = `
  "footer": *[_type == "site_settings"] {
    footer_column_1[] {
      _type == 'navitem' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
      _type == 'link' => @ {
        _type,
        _key,
        title,
        "url": url
      },
    },
    footer_column_2[] {
      _type == 'navitem' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
      _type == 'link' => @ {
        _type,
        _key,
        title,
        "url": url
      },
    },
    footer_column_3[] {
      _type == 'navitem' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
      _type == 'link' => @ {
        _type,
        _key,
        title,
        "url": url
      },
    }
  },
`;

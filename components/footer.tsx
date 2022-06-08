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
  footer_column_1: FooterItem[];
  footer_column_2: FooterItem[];
  footer_column_3: FooterItem[];
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
          {footer_column_1?.map((footerItem) => {
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
          {footer_column_2?.map((footerItem) => {
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
          {footer_column_3?.map((footerItem) => {
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

      <form className={`${styles.category} ${styles.newsletter__position}`}>
        <fieldset className={styles.newsletter}>
          <label className={styles.newsletter__label} htmlFor="nyhetsbrev">
            Meld meg på nyhetsbrevet
          </label>

          <div className={styles.input__inlinebutton}>
            <input type="text" name="nyhetbrev" placeholder="E-post" />
            <button aria-label="send e-post">SEND&nbsp;→</button>
          </div>
        </fieldset>
      </form>

      <div className={`${styles.category} ${styles.utillity}`}>
        <a href="#">Personvern</a>
        <p> &#169; {new Date().getFullYear()} Gi Effektivt</p>
        <a href="#top">Til toppen &uarr;</a>
      </div>
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

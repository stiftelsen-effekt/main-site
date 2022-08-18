import Link from "next/link";
import React from "react";
import elements from "./Links.module.scss";
import { NavLink } from "../../layout/navbar";

export type LinkType = {
  _type: "link";
  _key: string;
  title: string;
  url: string;
  newtab?: boolean;
};

export type LinksProps = {
  links: (LinkType | NavLink)[];
};

export const Links: React.FC<LinksProps> = ({ links }) => {
  return (
    <ul className={elements.links}>
      {links &&
        links.map((link) => (
          <li key={link._key}>
            <Link
              href={
                link._type === "navitem"
                  ? link.pagetype === "article_page"
                    ? `/articles/${link.slug}`
                    : `/${link.slug}`
                  : link.url
              }
              passHref
            >
              <a
                target={link._type === "link" && link.newtab ? "_blank" : ""}
              >{`→ ${link.title}`}</a>
            </Link>
          </li>
        ))}
    </ul>
  );
};

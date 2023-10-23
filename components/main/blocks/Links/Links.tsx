import Link from "next/link";
import React from "react";
import elements from "./Links.module.scss";
import { NavLink } from "../../layout/navbar";
import { useRouterContext } from "../../../../context/RouterContext";

export type LinkType = {
  _type: "link";
  _key: string;
  title?: string;
  url?: string;
  newtab?: boolean;
};

export type LinksProps = {
  links: (LinkType | NavLink)[];
};

export const Links: React.FC<LinksProps> = ({ links }) => {
  return (
    <ul className={elements.links}>
      {links &&
        links.filter(validateLink).map((link) => (
          <li key={link._key}>
            <LinkComponent link={link} />
          </li>
        ))}
    </ul>
  );
};

export const LinkComponent: React.FC<{ link: LinkType | NavLink; children?: string }> = ({
  link,
  children,
}) => {
  const { articlesPagePath } = useRouterContext();

  return (
    <Link
      href={
        link._type === "navitem"
          ? link.pagetype === "article_page"
            ? `/${[...articlesPagePath, link.slug].join("/")}`
            : `/${link.slug}`
          : link.url ?? (link as any).href ?? ""
      }
      passHref
    >
      <a
        target={link._type === "link" && link.newtab ? "_blank" : ""}
        onClick={(e) => {
          e.currentTarget.blur();
        }}
      >
        {link.title
          ? `→ ${link.title}`
          : `${children}${link._type === "link" && link.newtab ? " ↗" : ""}`}
      </a>
    </Link>
  );
};

const validateLink: (link: LinkType | NavLink) => boolean = (link) => {
  if (link._type === "navitem") return link.slug !== undefined && link.slug !== null;
  else return link.url !== undefined && link.url !== null;
};

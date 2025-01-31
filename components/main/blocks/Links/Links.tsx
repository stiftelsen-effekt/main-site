import Link from "next/link";
import React, { CSSProperties } from "react";
import elements from "./Links.module.scss";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { useRouterContext } from "../../../../context/RouterContext";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";

export type LinkType = {
  _type: "link";
  _key: string;
  title?: string;
  url?: string;
  newtab?: boolean;
};

export type LinksProps = {
  links: (LinkType | NavLink)[];
  buttons?: boolean;
};

export const Links: React.FC<LinksProps> = ({ links, buttons }) => {
  const { articlesPagePath } = useRouterContext();

  return (
    <ul className={elements.links}>
      {links &&
        links
          .filter(validateLink)
          .map((link) => (
            <li key={link._key}>
              {buttons ? (
                <LinkButton title={link.title ?? ""} url={getHref(link, articlesPagePath)} />
              ) : (
                <LinkComponent link={link} />
              )}
            </li>
          ))}
    </ul>
  );
};

export const LinkComponent: React.FC<{
  link: LinkType | NavLink;
  children?: string;
  style?: CSSProperties;
}> = ({ link, children, style }) => {
  const { articlesPagePath } = useRouterContext();

  return (
    <Link
      href={getHref(link, articlesPagePath)}
      target={link._type === "link" && link.newtab ? "_blank" : ""}
      onClick={(e) => {
        e.currentTarget.blur();
      }}
      style={style}
    >
      {link.title
        ? `→ ${link.title}`
        : `${children}${link._type === "link" && link.newtab ? " ↗" : ""}`}
    </Link>
  );
};

export const getHref = (link: NavLink | LinkType, articlesPagePath: string[]) => {
  return link._type === "navitem"
    ? link.pagetype === "article_page"
      ? `/${[...articlesPagePath, link.slug].join("/")}`
      : `/${link.slug}`
    : link.url ?? (link as any).href ?? "";
};

const validateLink: (link: LinkType | NavLink) => boolean = (link) => {
  if (link._type === "navitem") return link.slug !== undefined && link.slug !== null;
  else return link.url !== undefined && link.url !== null;
};

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
  const { articlesPagePath, fundraisersPath } = useRouterContext();

  return (
    <ul className={elements.links}>
      {links &&
        links.filter(validateLink).map((link) => {
          const { href, isFundraiser } = getHref(link, articlesPagePath, fundraisersPath);
          return (
            <li key={link._key}>
              {buttons ? (
                <LinkButton
                  title={link.title ?? ""}
                  url={href}
                  prefetch={isFundraiser ? false : undefined}
                />
              ) : (
                <LinkComponent link={link} />
              )}
            </li>
          );
        })}
    </ul>
  );
};

export const LinkComponent: React.FC<{
  link: LinkType | NavLink;
  children?: string;
  style?: CSSProperties;
  newtab?: boolean;
}> = ({ link, children, style, newtab }) => {
  const { articlesPagePath, fundraisersPath } = useRouterContext();
  const { href, isFundraiser } = getHref(link, articlesPagePath, fundraisersPath);
  const openInNewTab = (link._type === "link" && link.newtab) || newtab;

  return (
    <Link
      href={href}
      prefetch={isFundraiser ? false : undefined}
      target={openInNewTab ? "_blank" : ""}
      onClick={(e) => {
        e.currentTarget.blur();
      }}
      style={style}
    >
      {link.title ? `→ ${link.title}` : `${children}${openInNewTab ? " ↗" : ""}`}
    </Link>
  );
};

export const getHref = (
  link: NavLink | LinkType,
  articlesPagePath: string[],
  fundraisersPath: string[],
): { href: string; isFundraiser: boolean } => {
  if (link._type === "navitem") {
    switch (link.pagetype) {
      case "article_page":
        return { href: `/${[...articlesPagePath, link.slug].join("/")}`, isFundraiser: false };
      case "fundraiser_page":
        return { href: `/${[...fundraisersPath, link.slug].join("/")}`, isFundraiser: true };
      default:
        return { href: `/${link.slug}`, isFundraiser: false };
    }
  } else {
    return { href: link.url ?? (link as any).href ?? "", isFundraiser: false };
  }
};

const validateLink: (link: LinkType | NavLink) => boolean = (link) => {
  if (link._type === "navitem") return link.slug !== undefined && link.slug !== null;
  else return link.url !== undefined && link.url !== null;
};

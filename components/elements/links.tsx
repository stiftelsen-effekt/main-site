import Link from "next/link";
import React from "react";
import elements from "../../styles/Elements.module.css";

export type LinksProps = {
  links: { _key: string; title: string; url: string }[];
};

export const Links: React.FC<LinksProps> = ({ links }) => {
  return (
    <ul className={elements.links}>
      {links &&
        links.map((link: { _key: string; url: string; title: string }) => (
          <li key={link._key}>
            <Link href={link.url} passHref>{`→ ${link.title}`}</Link>
          </li>
        ))}
    </ul>
  );
};

import React from "react";
import styles from "./SplitViewHtml.module.scss";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Links } from "../Links/Links";
import { PortableText } from "@portabletext/react";

export const SplitViewHtml: React.FC<{
  title: string;
  swapped?: boolean;
  darktext?: boolean;
  paragraph: any[];
  links: (LinkType | NavLink)[];
  code: string;
}> = ({ title, swapped, darktext, paragraph, links, code }) => {
  const classes = [styles.splitview];
  if (swapped) classes.push(styles.swapped);

  if (darktext) classes.push(styles.darktext);

  return (
    <div className={classes.join(" ")}>
      <div className={styles.splitviewtext}>
        <div>
          <h4>{title}</h4>
          <PortableText value={paragraph} />
        </div>
        {links && <Links links={links} />}
      </div>
      <div className={styles.splitviewcode} dangerouslySetInnerHTML={{ __html: code }}></div>
    </div>
  );
};

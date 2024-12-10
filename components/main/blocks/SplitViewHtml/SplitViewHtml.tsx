import React from "react";
import styles from "./SplitViewHtml.module.scss";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Links } from "../Links/Links";
import { PortableText } from "@portabletext/react";
import { customComponentRenderers } from "../Paragraph/Citation";
import { FundraiserVippsNumberDisplay } from "./FundraiserVippsNumberDisplay";

export const SplitViewHtml: React.FC<{
  title: string;
  swapped?: boolean;
  rowSwapped?: boolean;
  darktext?: boolean;
  paragraph: any[];
  links: (LinkType | NavLink)[];
  code: string;
  adoveoFundraiserId?: string;
  vippsNumber?: string;
}> = ({
  title,
  swapped,
  rowSwapped,
  darktext,
  paragraph,
  links,
  code,
  adoveoFundraiserId,
  vippsNumber,
}) => {
  const classes = [styles.splitview];

  if (swapped) classes.push(styles.swapped);

  if (rowSwapped) classes.push(styles.rowSwapped);

  if (darktext) classes.push(styles.darktext);

  return (
    <div className={classes.join(" ")}>
      <div className={styles.splitviewtext}>
        <div>
          <h4>{title}</h4>
          <PortableText value={paragraph} components={customComponentRenderers} />
        </div>
        {links && <Links links={links} />}
      </div>
      <div className={styles.splitviewcode}>
        <div dangerouslySetInnerHTML={{ __html: code }}></div>
        {adoveoFundraiserId && vippsNumber && (
          <FundraiserVippsNumberDisplay
            fundraiserId={adoveoFundraiserId}
            vippsNumber={vippsNumber}
          ></FundraiserVippsNumberDisplay>
        )}
      </div>
    </div>
  );
};

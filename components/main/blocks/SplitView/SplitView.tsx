import React from "react";
import styles from "./SplitView.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Links } from "../Links/Links";
import { PortableText } from "@portabletext/react";
import { customComponentRenderers } from "../Paragraph/Citation";
import { SplitViewForm, SplitViewFormConfiguration } from "./SplitViewForm";

export interface SplitView {
  title: string;
  swapped?: boolean;
  rowSwapped?: boolean;
  darktext?: boolean;
  paragraph?: string;
  richText?: any[];
  links: (LinkType | NavLink)[];
  image: SanityImageObject;
  form?: SplitViewFormConfiguration;
}
export const SplitView: React.FC<SplitView> = ({
  title,
  swapped,
  rowSwapped,
  darktext,
  paragraph,
  richText,
  links,
  image,
  form,
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
          {richText?.length ? (
            <div className={styles.richtext}>
              <PortableText value={richText} components={customComponentRenderers} />
            </div>
          ) : (
            paragraph && <p>{paragraph}</p>
          )}
          {form?.formType && <SplitViewForm form={form} />}
        </div>
        {links?.length > 0 && <Links links={links} />}
      </div>
      <div className={styles.splitviewimage}>
        {image && <ResponsiveImage image={image} layout="responsive" />}
      </div>
    </div>
  );
};

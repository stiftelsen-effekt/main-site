import { useRouter } from "next/router";
import React from "react";
import styles from "./Columns.module.scss";
import { LinkType, Links } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { PortableText } from "@portabletext/react";
import { customComponentRenderers } from "../Paragraph/Citation";
export interface Columns {
  columns: {
    _key: string;
    title: string;
    paragraph: string;
    richText?: any[];
    links: Array<LinkType | NavLink>;
  }[];
}
export const Columns: React.FC<Columns> = ({ columns }) => {
  const router = useRouter();

  return (
    <div className={styles.grid}>
      {columns.filter(Boolean).map((column) => (
        <div className={styles.column} key={column._key}>
          <div>
            <h5>{column.title}</h5>
            {/* Rich text wins when it is set; older columns keep their plain paragraph */}
            {column.richText?.length ? (
              <PortableText value={column.richText} components={customComponentRenderers} />
            ) : (
              <p>{column.paragraph}</p>
            )}
          </div>
          {column.links && <Links links={column.links} />}
        </div>
      ))}
    </div>
  );
};

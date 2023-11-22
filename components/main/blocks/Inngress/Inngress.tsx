import styles from "./Inngress.module.scss";

import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { LinkType, Links } from "../Links/Links";
import { PortableText } from "@portabletext/react";

export const Inngress: React.FC<{
  header: string;
  content: any[];
  links: (LinkType | NavLink)[];
}> = ({ header, content, links }) => {
  return (
    <div className={styles.ingress__container}>
      <div className={styles.links}>
        <Links links={links} />
      </div>
      <div className={styles.intro}>
        <p className="inngress">{header}</p>
        <div className={styles.maincontent}>
          <PortableText value={content}></PortableText>
        </div>
      </div>
    </div>
  );
};

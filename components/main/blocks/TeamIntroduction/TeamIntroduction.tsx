import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { Contributor, Links as SanityLinks } from "../../../../studio/sanity.types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import styles from "./TeamIntroduction.module.scss";
import { PortableText } from "next-sanity";
import { customComponentRenderers } from "../Paragraph/Citation";
import { Links, LinkType } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";

export const TeamIntroduction: React.FC<{
  contributor: Contributor;
  links: SanityLinks;
  content: any[];
}> = ({ contributor, content, links }) => {
  if (!contributor) return null;
  if (!contributor.name) return null;

  const name = contributor.name.split(" ");
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <div className={styles.innerImage}>
          <ResponsiveImage
            image={contributor.image as SanityImageObject}
            layout={"cover"}
            sizes="(min-width: 1521px) 575px, (min-width: 1181px) 460px, (min-width: 601px) 400px, 200px"
          ></ResponsiveImage>
        </div>
        <div className={styles.mobileTitle}>
          <h4>{name[0]}</h4>
          <h4>{name[name.length - 1]}</h4>
          <div className={styles.contact}>
            {contributor.email && <a href={`mailto:${contributor.email}`}>{contributor.email}</a>}
            {contributor.phone && <a href={`tel:${contributor.phone}`}>{contributor.phone}</a>}
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          <h4>{contributor.name}</h4>
          <div className={styles.contact}>
            {contributor.email && <a href={`mailto:${contributor.email}`}>{contributor.email}</a>}
            {contributor.phone && <a href={`tel:${contributor.phone}`}>{contributor.phone}</a>}
          </div>
          <PortableText value={content} components={customComponentRenderers}></PortableText>
        </div>
        {links && <Links links={links.links as (NavLink | LinkType)[]}></Links>}
      </div>
    </div>
  );
};

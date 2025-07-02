import Link from "next/link";
import ResponsiveImage from "../../../shared/responsiveimage";
import styles from "./MediaCoverageTeaser.module.scss";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";
import { Links } from "../Links/Links";

export const MediaCoverageTeaser: React.FC<{
  title: string;
  coverage: {
    links: {
      link: string;
      link_text: string;
    }[];
    publication_logo: {
      asset: {
        _id: string;
        metadata: {
          lqip: string;
        };
      };
    };
  }[];
  readMoreButton: NavLink;
}> = ({ title, coverage, readMoreButton }) => {
  return (
    <div className={styles.container}>
      <div className={styles.coverageList}>
        {coverage &&
          coverage.map((item, index) => (
            <div key={index} className={styles.coverageItem}>
              <div className={styles.logo}>
                {item.publication_logo && (
                  <ResponsiveImage image={item.publication_logo} layout="fill" />
                )}
              </div>
              <div className={styles.details}>
                <ul className={styles.links}>
                  {item.links &&
                    item.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link href={link.link} target="_blank" rel="noopener noreferrer">
                          <span>{link.link_text}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
      </div>

      {readMoreButton && (
        <div className={styles.readMore}>
          <Links links={[readMoreButton]} buttons></Links>
        </div>
      )}
    </div>
  );
};

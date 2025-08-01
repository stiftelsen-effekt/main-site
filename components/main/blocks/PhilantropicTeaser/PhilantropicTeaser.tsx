import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Contributor, ContributorType } from "../Contributors/Contributor";
import { LinkComponent, LinkType, getHref } from "../Links/Links";
import styles from "./PhilantropicTeaser.module.scss";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";

export const PhilantropicTeaser: React.FC<{
  title: string;
  description: any[];
  links: (LinkType | NavLink)[];
  button: {
    text: string;
    link: NavLink;
  };
  people: ContributorType[];
  locale?: string;
}> = ({ title, description, links, button, people, locale }) => {
  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <h3>{title}</h3>
        <div className={styles.text}>
          <PortableText value={description || []}></PortableText>
        </div>
        <div className={styles.links}>
          {links && links.map((link) => <LinkComponent link={link} key={link._key} />)}
        </div>
        {button && button.text && button.link && (
          <div className={styles.button}>
            <LinkButton url={getHref(button.link, [])} title={button.text} type="primary" />
          </div>
        )}
      </div>
      <div className={styles.people}>
        {people.map((person) => (
          <Contributor {...person} key={person._id} locale={locale} contactLink />
        ))}
      </div>
    </div>
  );
};

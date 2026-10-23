import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Contributor, ContributorType } from "../Contributors/Contributor";
import { LinkComponent, LinkType, getHref } from "../Links/Links";
import styles from "./PhilantropicTeaser.module.scss";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";
import { useRouterContext } from "../../../../context/RouterContext";

/* Two columns inside the right half of a two-column grid; one column of two on mobile */
const PEOPLE_SIZES =
  "(min-width: 1920px) 354px, (min-width: 1521px) calc(22.5vw - 75px), (min-width: 1181px) calc(22.5vw - 60px), calc(45vw - 8px)";

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
  const { articlesPagePath, fundraisersPath } = useRouterContext();

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
        {button &&
          button.text &&
          button.link &&
          (() => {
            const { href, isFundraiser } = getHref(button.link, articlesPagePath, fundraisersPath);
            return (
              <div className={styles.button}>
                <LinkButton
                  url={href}
                  title={button.text}
                  type="primary"
                  prefetch={isFundraiser ? false : undefined}
                />
              </div>
            );
          })()}
      </div>
      <div className={styles.people}>
        {people.map((person) => (
          <Contributor
            {...person}
            key={person._id}
            locale={locale}
            sizes={PEOPLE_SIZES}
            contactLink
          />
        ))}
      </div>
    </div>
  );
};

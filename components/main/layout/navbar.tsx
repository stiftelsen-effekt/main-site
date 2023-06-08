import React, { useContext, useState } from "react";
import styles from "../../shared/layout/Navbar/Navbar.module.scss";
import Link from "next/link";
import { Menu, X } from "react-feather";
import AnimateHeight from "react-animate-height";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { WidgetContext } from "./layout";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../shared/components/EffektButton/EffektButton";
import { ResponsiveImage } from "../../shared/responsiveimage";
import { useRouterContext } from "../../../context/RouterContext";
import { withStaticProps } from "../../../util/withStaticProps";
import { groq } from "next-sanity";
import { getClient } from "../../../lib/sanity.server";

export type NavLink = {
  _type: "navitem";
  _key: string;
  title?: string;
  pagetype?: string;
  slug?: string;
};

export type MainNavbarGroup = {
  _type: "navgroup";
  _key: string;
  title: string;
  items: NavLink[];
};

export type MainNavbarItem = NavLink | MainNavbarGroup;

const fetchNavbar = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
    main_navigation[] {
      _type == 'navgroup' => {
        _type,
        _key,
        title,
        items[]->{
          title,
          "slug": page->slug.current
        },
      },
      _type != 'navgroup' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
    }
  }
}`;

export const Navbar = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<{
    settings: {
      logo: SanityImageSource;
      main_navigation: MainNavbarItem[];
    }[];
  }>(fetchNavbar);
  return {
    data: {
      elements: result.settings[0].main_navigation.filter((e) => e !== null),
      logo: result.settings[0].logo,
    },
  };
})(({ data: { elements, logo } }) => {
  const { dashboardPath } = useRouterContext();
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<{ [key: string]: boolean }>(
    elements.reduce((a, v) => ({ ...a, [v._key]: false }), {}),
  );

  const setExpanded = (expanded: boolean) => {
    if (expanded && window.innerWidth < 1180) document.body.style.overflow = "hidden";
    else if (typeof document !== "undefined") document.body.style.overflow = "auto";

    setExpandMenu(expanded);
  };

  const toggleExpanded = (key: string) => {
    if (expandMenu) {
      const expanded = { ...expandedSubmenu };
      expanded[key] = !expandedSubmenu[key];
      setExpandedSubmenu(expanded);
    }
  };

  return (
    <div className={`${styles.container} ${expandMenu ? styles.navbarExpanded : ""}`}>
      <nav className={`${styles.navbar}`} data-cy="navbar">
        <div
          className={styles.logoWrapper}
          onMouseDown={(e) => (e.currentTarget.style.outline = "none")}
          onMouseUp={(e) => e.currentTarget.removeAttribute("style")}
        >
          <div className={styles.logoWrapperImage}>
            <Link href="/">
              <a onClick={(e) => e.currentTarget.blur()}>
                <ResponsiveImage
                  image={logo}
                  onClick={() => setExpanded(false)}
                  priority
                  blur={false}
                />
              </a>
            </Link>
          </div>
          <button
            className={styles.expandBtn}
            onClick={(e) => {
              setExpanded(!expandMenu);
              e.currentTarget.blur();
            }}
          >
            {expandMenu ? <X size={32} color={"black"} /> : <Menu size={32} color={"black"} />}
          </button>
        </div>
        <ul>
          {elements.map((el) =>
            el._type === "navgroup" ? (
              <li
                key={el._key}
                className={
                  expandedSubmenu[el._key] ? styles.expandedSubmenu : styles.collapsedSubmenu
                }
              >
                <button onClick={() => toggleExpanded(el._key)} tabIndex={-1}>
                  {el.title}
                </button>
                <AnimateHeight height={expandedSubmenu[el._key] ? "auto" : 0} animateOpacity>
                  <div className={styles.submenu}>
                    <ul>
                      {el.items &&
                        el.items.map((subel) => (
                          <li key={subel.title} data-cy={`${subel.title}-link`.replace(/ /g, "-")}>
                            <Link href={`/${subel.slug}`} passHref>
                              <a
                                onClick={(e) => {
                                  e.currentTarget.blur();
                                  setExpanded(false);
                                }}
                              >
                                {subel.title}
                              </a>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </AnimateHeight>
              </li>
            ) : (
              <li key={el._key} data-cy={`${el.slug}-link`}>
                <Link href={`/${el.slug}`} passHref>
                  <a onClick={() => setExpanded(false)}>{el.title}</a>
                </Link>
              </li>
            ),
          )}
          <li className={styles.buttonsWrapper}>
            <Link href={dashboardPath.join("/")} passHref>
              <a tabIndex={-1}>
                <EffektButton
                  variant={EffektButtonVariant.SECONDARY}
                  onClick={() => setExpanded(false)}
                >
                  Min side
                </EffektButton>
              </a>
            </Link>
            <EffektButton
              cy="send-donation-button"
              extraMargin={true}
              onClick={() => setWidgetOpen(true)}
            >
              Send donasjon
            </EffektButton>
          </li>
        </ul>
      </nav>
    </div>
  );
});

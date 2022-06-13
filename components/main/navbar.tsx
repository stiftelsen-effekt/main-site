import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/Navbar.module.css";
import Link from "next/link";
import { Menu, X } from "react-feather";
import AnimateHeight from "react-animate-height";
import { Dictionary } from "lodash";
import { ResponsiveImage } from "../elements/responsiveimage";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { EffektButton } from "../elements/effektbutton";
import { WidgetContext } from "./layout";

export type MainNavbarLink = {
  _type: "navitem";
  _key: string;
  title: string;
  slug: string;
};

export type MainNavbarGroup = {
  _type: "navgroup";
  _key: string;
  title: string;
  items: MainNavbarLink[];
};

export type MainNavbarItem = MainNavbarLink | MainNavbarGroup;

export type MainNavbarProps = {
  logo: SanityImageSource;
  elements: MainNavbarItem[];
};

export const Navbar: React.FC<MainNavbarProps> = ({ elements, logo }) => {
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<Dictionary<boolean>>(
    elements.reduce((a, v) => ({ ...a, [v._key]: false }), {}),
  );

  const setExpanded = (expanded: boolean) => {
    if (expanded && window.innerWidth < 900) document.documentElement.style.overflow = "hidden";
    else if (typeof document !== "undefined") document.documentElement.style.overflow = "auto";

    setExpandMenu(expanded);
  };

  const toggleExpanded = (key: string) => {
    const expanded = { ...expandedSubmenu };
    expanded[key] = !expandedSubmenu[key];
    setExpandedSubmenu(expanded);
  };

  return (
    <nav className={`${styles.navbar} ${expandMenu ? styles.navbarExpanded : ""}`} data-cy="navbar">
      <div className={styles.logoWrapper}>
        <div className={styles.logoWrapperImage}>
          <Link href="/">
            <a>
              <ResponsiveImage image={logo} onClick={() => setExpanded(false)} priority />
            </a>
          </Link>
        </div>
        <button className={styles.expandBtn} onClick={() => setExpanded(!expandMenu)}>
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
              <button onClick={() => toggleExpanded(el._key)}>{el.title}</button>
              <AnimateHeight height={expandedSubmenu[el._key] ? "auto" : "0%"} animateOpacity>
                <div className={styles.submenu}>
                  <ul>
                    {el.items.map((subel) => (
                      <li key={subel.title} onClick={() => setExpanded(false)}>
                        <Link href={`/${subel.slug}`} passHref>
                          {subel.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateHeight>
            </li>
          ) : (
            <li key={el._key} onClick={() => setExpanded(false)}>
              <Link href={`/${el.slug}`} passHref>
                {el.title}
              </Link>
            </li>
          ),
        )}
        <li className={styles.buttonsWrapper}>
          <Link href="/profile">
            <a className={styles.btnlogin}>Logg inn</a>
          </Link>
          <EffektButton onClick={() => setWidgetOpen(true)}>Send donasjon</EffektButton>
        </li>
      </ul>
    </nav>
  );
};

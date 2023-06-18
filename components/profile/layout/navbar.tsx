import React, { useContext, useState } from "react";
import styles from "../../shared/layout/Navbar/Navbar.module.scss";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, X } from "react-feather";
import { ResponsiveImage } from "../../shared/responsiveimage";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { EffektButton, EffektButtonType } from "../../shared/components/EffektButton/EffektButton";
import { WidgetContext } from "../../main/layout/layout";
import { useRouterContext } from "../../../context/RouterContext";
import { MainNavbarGroup, NavLink } from "../../main/layout/navbar";
import AnimateHeight from "react-animate-height";

export type ProfileNavbarItem = NavLink | MainNavbarGroup;

export type ProfileNavbarProps = {
  logo: SanityImageSource;
  elements: ProfileNavbarItem[];
};

export const Navbar: React.FC<ProfileNavbarProps> = ({ elements, logo }) => {
  const filteredElements = elements.filter((e) => e !== null);
  const { dashboardPath, agreementsPagePath, taxPagePath, profilePagePath } = useRouterContext();
  const { user, logout, loginWithRedirect } = useAuth0();
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<{ [key: string]: boolean }>(
    filteredElements.reduce((a, v) => ({ ...a, [v._key]: false }), {}),
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

  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  return (
    <div className={`${styles.container} ${expandMenu ? styles.navbarExpanded : ""}`}>
      <nav className={`${styles.navbar}`} data-cy="navbar">
        <div
          className={styles.logoWrapper}
          onMouseDown={(e) => (e.currentTarget.style.outline = "none")}
          onMouseUp={(e) => e.currentTarget.removeAttribute("style")}
        >
          <div className={styles.logoWrapperImage}>
            <Link href="/" passHref>
              <a onClick={(e) => e.currentTarget.blur()}>
                <ResponsiveImage
                  image={logo}
                  onClick={() => setExpandMenu(false)}
                  priority
                  blur={false}
                />
              </a>
            </Link>
          </div>
          <button
            className={styles.expandBtn}
            onClick={(e) => {
              setExpandMenu(!expandMenu);
              e.currentTarget.blur();
            }}
          >
            {expandMenu ? <X size={32} color={"black"} /> : <Menu size={32} color={"black"} />}
          </button>
        </div>
        <ul>
          {filteredElements.map((el) =>
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
                <AnimateHeight height={expandedSubmenu[el._key] ? "auto" : "0%"} animateOpacity>
                  <div className={styles.submenu}>
                    <ul>
                      {el.items &&
                        el.items
                          .filter((subel) => subel !== null)
                          .map((subel) => (
                            <li
                              key={subel.title}
                              data-cy={`${subel.title}-link`.replace(/ /g, "-")}
                            >
                              <Link href={`${dashboardPath}/${subel.slug}`} passHref>
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
                <Link href={`${dashboardPath}/${el.slug}`} passHref>
                  <a onClick={() => setExpanded(false)}>{el.title}</a>
                </Link>
              </li>
            ),
          )}
          {/** 
          <li onClick={() => setExpandMenu(false)}>
            <Link href={dashboardPath.join("/")} passHref>
              Donasjoner
            </Link>
          </li>
          {agreementsPagePath ? (
            <li onClick={() => setExpandMenu(false)}>
              <Link href={agreementsPagePath.join("/")} passHref>
                Avtaler
              </Link>
            </li>
          ) : null}
          {taxPagePath ? (
            <li onClick={() => setExpandMenu(false)}>
              <Link href={taxPagePath.join("/")} passHref>
                Skatt
              </Link>
            </li>
          ) : null}
          {profilePagePath ? (
            <li onClick={() => setExpandMenu(false)}>
              <Link href={profilePagePath.join("/")} passHref>
                Profil
              </Link>
            </li>
          ) : null}
          */}
          <li className={styles.buttonsWrapper} onClick={() => setExpandMenu(false)}>
            {user ? (
              <EffektButton
                type={EffektButtonType.SECONDARY}
                onClick={() => logout({ returnTo: process.env.NEXT_PUBLIC_SITE_URL })}
                extraMargin={true}
              >
                Logg ut
              </EffektButton>
            ) : (
              <EffektButton
                type={EffektButtonType.SECONDARY}
                onClick={() => loginWithRedirect({ returnTo: process.env.NEXT_PUBLIC_SITE_URL })}
                extraMargin={true}
              >
                Logg inn
              </EffektButton>
            )}
            <EffektButton
              cy="send-donation-button"
              onClick={() => setWidgetOpen(true)}
              extraMargin={true}
            >
              Send donasjon
            </EffektButton>
          </li>
        </ul>
      </nav>
    </div>
  );
};

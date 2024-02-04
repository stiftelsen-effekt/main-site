import React, { useContext, useState } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { Menu, X } from "react-feather";
import AnimateHeight from "react-animate-height";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { WidgetContext } from "../../../main/layout/layout";
import { EffektButton, EffektButtonVariant } from "../EffektButton/EffektButton";
import { ResponsiveImage } from "../../responsiveimage";
import { useRouterContext } from "../../../../context/RouterContext";
import { withStaticProps } from "../../../../util/withStaticProps";
import { groq } from "next-sanity";
import { getClient } from "../../../../lib/sanity.server";
import { useAuth0 } from "@auth0/auth0-react";

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

type QueryResult = {
  settings: [
    {
      logo: SanityImageSource;
      main_navigation: MainNavbarItem[];
      donate_label: string;
      accent_color: string;
    },
  ];
  dashboard: [
    {
      main_navigation: MainNavbarItem[];
      dashboard_logo: SanityImageSource;
      dashboard_label: string;
      logout_label: string;
    },
  ];
};

const query = groq`
  {
    "dashboard": *[_id == "dashboard"] {
      dashboard_label,
      logout_label,
      dashboard_logo,
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
    },
    "settings": *[_type == "site_settings"] {
      logo,
      donate_label,
      accent_color,
      main_navigation[] {
        _type == 'navgroup' => {
          _type,
          _key,
          title,
          items[] {
            title,
            "slug": page->slug.current
          },
        },
        _type != 'navgroup' => @ {
          _type,
          _key,
          title,
          "slug": page->slug.current
        }
      }
    }
  }
`;

export const Navbar = withStaticProps(
  async ({ dashboard, preview }: { dashboard: boolean; preview: boolean }) => {
    const result = await getClient(preview).fetch<QueryResult>(query);
    const settings = result.settings[0];
    const dashboardData = result.dashboard[0];
    const elements = dashboard ? dashboardData.main_navigation : settings.main_navigation;

    return {
      dashboard,
      elements: elements.filter((e) => e !== null),
      logo: settings.logo,
      dashboardLogo: dashboardData.dashboard_logo,
      labels: {
        dashboard: dashboardData.dashboard_label,
        logout: dashboardData.logout_label,
      },
      giveButton: {
        donate_label: settings.donate_label,
        accent_color: settings.accent_color,
      },
    };
  },
)(({ dashboard, elements, logo, dashboardLogo, labels, giveButton }) => {
  const { dashboardPath } = useRouterContext();
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);
  const { user, logout } = useAuth0();

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

  let giveButtonStyle = {};
  if (giveButton.accent_color) {
    giveButtonStyle = {
      backgroundColor: giveButton.accent_color,
      color: "white",
      border: `1px solid ${giveButton.accent_color} !important`,
      borderColor: giveButton.accent_color,
    };
  }

  const lightLogo = (dashboard && !expandMenu) || (!dashboard && expandMenu);

  return (
    <div className={`${styles.container} ${expandMenu ? styles.navbarExpanded : ""}`}>
      <nav className={`${styles.navbar}`} data-cy="navbar">
        <div
          className={styles.logoWrapper}
          onMouseDown={(e) => (e.currentTarget.style.outline = "none")}
          onMouseUp={(e) => e.currentTarget.removeAttribute("style")}
        >
          {lightLogo && (
            <div className={styles.logoWrapperImage}>
              <Link href="/" passHref>
                <a onClick={(e) => e.currentTarget.blur()}>
                  <ResponsiveImage
                    image={dashboardLogo}
                    onClick={() => setExpanded(false)}
                    priority
                    blur={false}
                  />
                </a>
              </Link>
            </div>
          )}
          {!lightLogo && (
            <div className={styles.logoWrapperImage}>
              <Link href="/" passHref>
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
          )}
          <button
            className={styles.expandBtn}
            onClick={(e) => {
              setExpanded(!expandMenu);
              e.currentTarget.blur();
            }}
          >
            {expandMenu ? (
              <X size={32} color={lightLogo ? "white" : "black"} />
            ) : (
              <Menu size={32} color={lightLogo ? "black" : "black"} />
            )}
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
                        el.items
                          .filter((subel) => subel !== null)
                          .map((subel) => (
                            <li key={subel.title} data-cy={`${subel.slug}-link`.replace(/ /g, "-")}>
                              <Link
                                href={[...(dashboard ? dashboardPath : []), subel.slug].join("/")}
                                passHref
                              >
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
                <Link href={[...(dashboard ? dashboardPath : []), el.slug].join("/")} passHref>
                  <a onClick={() => setExpanded(false)}>{el.title}</a>
                </Link>
              </li>
            ),
          )}
          <li className={styles.buttonsWrapper}>
            {user ? (
              <EffektButton
                variant={EffektButtonVariant.SECONDARY}
                onClick={() => logout({ returnTo: process.env.NEXT_PUBLIC_SITE_URL })}
                extraMargin={true}
              >
                {labels.logout}
              </EffektButton>
            ) : (
              <Link href={dashboardPath.join("/")} passHref>
                <a tabIndex={-1}>
                  <EffektButton
                    variant={EffektButtonVariant.SECONDARY}
                    onClick={() => setExpanded(false)}
                  >
                    {labels.dashboard}
                  </EffektButton>
                </a>
              </Link>
            )}
            <EffektButton
              cy="send-donation-button"
              extraMargin={true}
              onClick={() => setWidgetOpen(true)}
              style={giveButtonStyle}
            >
              {giveButton.donate_label}
            </EffektButton>
          </li>
        </ul>
      </nav>
    </div>
  );
});

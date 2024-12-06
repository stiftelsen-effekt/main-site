import React, { useContext, useState } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { Menu, X } from "react-feather";
import AnimateHeight from "react-animate-height";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { WidgetContext } from "../../../main/layout/layout";
import { EffektButton, EffektButtonVariant } from "../EffektButton/EffektButton";
import { ResponsiveImage } from "../../responsiveimage";
import { useRouterContext } from "../../../../context/RouterContext";
import { withStaticProps } from "../../../../util/withStaticProps";
import { groq } from "next-sanity";
import { getClient } from "../../../../lib/sanity.client";
import { useAuth0 } from "@auth0/auth0-react";
import { token } from "../../../../token";
import { stegaClean } from "@sanity/client/stega";
import { CustomLink } from "../CustomLink/CustomLink";

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
  settings: {
    logo: SanityImageObject;
    main_navigation: MainNavbarItem[];
    donate_label: string;
    accent_color: string;
  };
  dashboard: {
    main_navigation: MainNavbarItem[];
    dashboard_logo: SanityImageObject;
    dashboard_label: string;
    logout_label: string;
  };
};

const query = groq`
{
  "dashboard": *[_id == "dashboard"][0] {
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
  "settings": *[_type == "site_settings"][0] {
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
  async ({
    dashboard,
    useDashboardLogo,
    draftMode = false,
  }: {
    dashboard: boolean;
    draftMode: boolean;
    useDashboardLogo?: boolean;
  }) => {
    const result = await getClient(draftMode ? token : undefined).fetch<QueryResult>(query);

    return {
      dashboard,
      useDashboardLogo: useDashboardLogo || null,
      data: {
        result,
        query,
      },
    };
  },
)(({ data, dashboard, useDashboardLogo }) => {
  const settingsData = data.result.settings;
  const dashboardData = data.result.dashboard;

  let filteredElements = dashboard
    ? data.result.dashboard.main_navigation
    : data.result.settings.main_navigation;
  filteredElements = filteredElements.filter((e) => e !== null);
  const logo = data.result.settings.logo;

  const dashboardLogo = data.result.dashboard.dashboard_logo;

  const labels = {
    dashboard: dashboardData.dashboard_label,
    logout: dashboardData.logout_label,
  };

  const giveButton = {
    donate_label: settingsData.donate_label,
    accent_color: stegaClean(settingsData.accent_color),
  };

  const { dashboardPath } = useRouterContext();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const { user, logout } = useAuth0();

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

  let giveButtonStyle = {};
  if (giveButton.accent_color) {
    giveButtonStyle = {
      backgroundColor: giveButton.accent_color,
      color: "white",
      border: `1px solid ${giveButton.accent_color} !important`,
      borderColor: giveButton.accent_color,
    };
  }

  const lightLogo =
    ((useDashboardLogo || dashboard) && !expandMenu) ||
    (!useDashboardLogo && !dashboard && expandMenu);

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
              <CustomLink
                href="/"
                passHref
                onClick={(e) => e.currentTarget.blur()}
                style={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  display: "inline-block",
                }}
              >
                <ResponsiveImage
                  image={dashboardLogo}
                  onClick={() => setExpanded(false)}
                  priority
                />
              </CustomLink>
            </div>
          )}
          {!lightLogo && (
            <div className={styles.logoWrapperImage}>
              <CustomLink
                href="/"
                passHref
                onClick={(e) => e.currentTarget.blur()}
                style={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  display: "inline-block",
                }}
              >
                <ResponsiveImage image={logo} onClick={() => setExpanded(false)} priority />
              </CustomLink>
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
              <X size={32} color={dashboard || useDashboardLogo ? "black" : "white"} />
            ) : (
              <Menu size={32} color={dashboard || useDashboardLogo ? "white" : "black"} />
            )}
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
                <AnimateHeight height={expandedSubmenu[el._key] ? "auto" : 0} animateOpacity>
                  <div className={styles.submenu}>
                    <ul>
                      {el.items &&
                        el.items
                          .filter((subel) => subel !== null)
                          .map((subel) => (
                            <li key={subel.title} data-cy={`${subel.slug}-link`.replace(/ /g, "-")}>
                              <CustomLink
                                href={[...(dashboard ? dashboardPath : []), subel.slug].join("/")}
                                passHref
                                onClick={(e) => {
                                  e.currentTarget.blur();
                                  setExpanded(false);
                                }}
                              >
                                {subel.title}
                              </CustomLink>
                            </li>
                          ))}
                    </ul>
                  </div>
                </AnimateHeight>
              </li>
            ) : (
              <li key={el._key} data-cy={`${el.slug}-link`}>
                <CustomLink
                  href={[...(dashboard ? dashboardPath : []), el.slug].join("/")}
                  passHref
                  onClick={() => setExpanded(false)}
                >
                  {el.title}
                </CustomLink>
              </li>
            ),
          )}
          <li className={styles.buttonsWrapper}>
            {user ? (
              <EffektButton
                variant={EffektButtonVariant.SECONDARY}
                onClick={() =>
                  logout({ logoutParams: { returnTo: process.env.NEXT_PUBLIC_SITE_URL } })
                }
                extraMargin={true}
              >
                {labels.logout}
              </EffektButton>
            ) : (
              <CustomLink href={dashboardPath.join("/")} passHref tabIndex={-1}>
                <EffektButton
                  variant={EffektButtonVariant.SECONDARY}
                  onClick={() => setExpanded(false)}
                >
                  {labels.dashboard}
                </EffektButton>
              </CustomLink>
            )}
            <EffektButton
              cy="send-donation-button"
              extraMargin={true}
              onClick={() => setWidgetContext({ open: true, prefilled: null, prefilledSum: null })}
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

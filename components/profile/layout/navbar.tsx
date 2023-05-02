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

export type ProfileNavbarProps = {
  logo: SanityImageSource;
};

export const Navbar: React.FC<ProfileNavbarProps> = ({ logo }) => {
  const { dashboardPath, agreementsPagePath, taxPagePath, profilePagePath } = useRouterContext();
  const { logout } = useAuth0();
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
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
          <li className={styles.buttonsWrapper} onClick={() => setExpandMenu(false)}>
            <EffektButton
              type={EffektButtonType.SECONDARY}
              onClick={() => logout({ returnTo: process.env.NEXT_PUBLIC_SITE_URL })}
              extraMargin={true}
            >
              Logg ut
            </EffektButton>
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

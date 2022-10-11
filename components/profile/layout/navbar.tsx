import React, { useContext, useState } from "react";
import styles from "../../shared/layout/Navbar/Navbar.module.scss";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, X } from "react-feather";
import { ResponsiveImage } from "../../shared/responsiveimage";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { EffektButton, EffektButtonType } from "../../shared/components/EffektButton/EffektButton";
import { WidgetContext } from "../../main/layout/layout";

export type ProfileNavbarProps = {
  logo: SanityImageSource;
};
export const Navbar: React.FC<ProfileNavbarProps> = ({ logo }) => {
  const { logout } = useAuth0();
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  return (
    <div className={`${styles.container} ${expandMenu ? styles.navbarExpanded : ""}`}>
      <nav className={`${styles.navbar}`} data-cy="navbar">
        <div className={styles.logoWrapper}>
          <div className={styles.logoWrapperImage}>
            <Link href="/" passHref>
              <ResponsiveImage image={logo} onClick={() => setExpandMenu(false)} priority />
            </Link>
          </div>
          <button className={styles.expandBtn} onClick={() => setExpandMenu(!expandMenu)}>
            {expandMenu ? <X size={32} color={"black"} /> : <Menu size={32} color={"black"} />}
          </button>
        </div>
        <ul>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile" passHref>
              Donasjoner
            </Link>
          </li>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile/agreements" passHref>
              Avtaler
            </Link>
          </li>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile/tax" passHref>
              Skatt
            </Link>
          </li>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile/details" passHref>
              Profil
            </Link>
          </li>
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

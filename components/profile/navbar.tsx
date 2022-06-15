import React, { useState } from "react";
import styles from "../../styles/Navbar.module.css";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, X } from "react-feather";
import { ResponsiveImage } from "../elements/responsiveimage";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type ProfileNavbarProps = {
  logo: SanityImageSource;
};
export const Navbar: React.FC<ProfileNavbarProps> = ({ logo }) => {
  const { logout } = useAuth0();
  const [expandMenu, setExpandMenu] = useState<boolean>(false);

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
            <Link href="/profile/details" passHref>
              Profil
            </Link>
          </li>
          <li className={styles.btnLogoutWrapper} onClick={() => setExpandMenu(false)}>
            <button className={styles.btnlogin} onClick={() => logout()}>
              Logg ut
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

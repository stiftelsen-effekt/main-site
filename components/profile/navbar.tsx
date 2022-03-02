import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Navbar.module.css";
import logo from "../../public/logo.svg";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar: React.FC = () => {
  const { logout, user } = useAuth0();
  const [linkStyle, setLinkStyle] = useState(styles.links);

  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <nav className={styles.navbar}>
        <a
          className={styles.icon}
          onClick={() =>
            linkStyle == styles.links
              ? (setLinkStyle(styles.showlinks), console.log(linkStyle))
              : (setLinkStyle(styles.links), console.log(linkStyle))
          }
        >
          <i className="fa fa-bars"></i>
        </a>
        <Image
          src={logo}
          className={styles.logo}
          layout="intrinsic"
          width={160}
          height={80}
          alt="Konduit. logo"
          priority
        />
        <ul className={linkStyle}>
          <li>
            <Link href="/profile" passHref>
              Mine donasjoner
            </Link>
          </li>
          <li>
            <Link href="/profile/details" passHref>
              Profil
            </Link>
          </li>
          <li>
            <button className={styles.btnlogout} onClick={() => logout()}>
              Logg ut
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
function usestate(links: string): [any, any] {
  throw new Error("Function not implemented.");
}


import Image from "next/image";
import React from "react";
import styles from "../../styles/Navbar.module.css"
import logo from "../../public/logo-cropped.svg"
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar: React.FC = () => {
  const {
    logout,
    user
  } = useAuth0();

  return (
    <nav className={styles.navbar}>
      <Link href="/" passHref>
        <Image src={logo} 
          className={styles.logo} 
          layout="intrinsic" 
          width={140} 
          height={80}
          alt="Konduit. logo" 
          priority/>
      </Link>
      <ul className={styles.links}>
        <li><Link href="/profile" passHref>Mine donasjoner</Link></li>
        <li><Link href="/profile/details" passHref>Profil</Link></li>
        <li><button className={styles.btnlogout} onClick={() => logout()}>Log ut</button></li>
      </ul>
    </nav>
  )
}
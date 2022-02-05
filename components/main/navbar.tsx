import Image from "next/image";
import React from "react";
import styles from "../../styles/Navbar.module.css"
import logo from "../../public/logo.svg"
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <Image src={logo} 
        className={styles.logo} 
        layout="intrinsic" 
        width={160} 
        height={80}
        alt="Konduit. logo" 
        priority/>      
      <ul className={styles.links}>
        <li><Link href="/organizations" passHref>Anbefalte organisasjoner</Link></li>
        <li><Link href="/method" passHref>Metode</Link></li>
        <li><Link href="/about" passHref>Om oss</Link></li>
        <li><Link href="/FAQ" passHref>FAQ</Link></li>
        <li><Link href="/profile" passHref>Min side</Link></li>
      </ul>
    </nav>
  )
}
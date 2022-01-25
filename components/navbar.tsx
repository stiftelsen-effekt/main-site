import Image from "next/image";
import React from "react";
import styles from "../styles/Navbar.module.css"
import logo from "../public/logo.svg"
import Link from "next/link";

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/" passHref>
        <Image src={logo} className={styles.logo} layout="fixed" width={160} alt="Konduit. logo"/>
      </Link>
      <ul className={styles.links}>
        <li>Anbefalte organisasjoner</li>
        <li>Metode</li>
        <Link href="/about" passHref><li>Om oss</li></Link>
        <li>FAQ</li>
        <li>Skattefradrag</li>
      </ul>
    </nav>
  )
}
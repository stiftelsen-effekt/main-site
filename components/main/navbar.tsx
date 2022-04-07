import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Navbar.module.css"
import logo from "../../public/logo-cropped.svg"
import Link from "next/link";
import { Menu, X } from "react-feather";

export const Navbar: React.FC = () => {
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  return (
    <nav className={(expandMenu ? styles.navbar +" "+ styles.navbarExpanded: styles.navbar)}>
      <div className={styles.logoWrapper}>
        <Link href="/" passHref>
          <Image src={logo} 
            className={styles.logo} 
            layout="intrinsic" 
            width={140} 
            height={80}
            alt="Konduit. logo"
            onClick={() => setExpandMenu(false)}
            priority/>
        </Link>
        <div className={styles.expandBtn} onClick={() => setExpandMenu(!expandMenu)}>
          {expandMenu ?
            <X size={32} color={"black"} /> :
            <Menu size={32} color={"black"} />
          }
          </div>   
        </div>   
      <ul>
        <li onClick={() => setExpandMenu(false)}><Link href="/organizations" passHref>Anbefalte organisasjoner</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/method" passHref>Metode</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/about" passHref>Om oss</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/faq" passHref>FAQ</Link></li>
        <li onClick={() => setExpandMenu(false)} className={styles.btnlogin}><Link href="/profile" passHref>Logg inn</Link></li>
      </ul>
    </nav>
  )
}
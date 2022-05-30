import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Navbar.module.css"
import logo from "../../public/logo-cropped.svg"
import Link from "next/link";
import { Menu, X } from "react-feather";
import AnimateHeight from "react-animate-height";
import { Dictionary } from "lodash";

export type MainNavbarLink = {
  _type: "navitem",
  _key: string,
  title: string,
  slug: string
}

export type MainNavbarGroup = {
  _type: "navgroup",
  _key: string,
  title: string,
  items: MainNavbarLink[]
}

export type MainNavbarItem = MainNavbarLink | MainNavbarGroup

export type MainNavbarProps = {
  elements: MainNavbarItem[]
}

export const Navbar: React.FC<MainNavbarProps> = ({ elements }) => {
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<Dictionary<boolean>>(elements.reduce((a,v) => ({ ...a, [v._key]: false }), {}))
  const [rerender, setRerender] = useState(false)

  const setExpanded = (expanded: boolean) => {
    if (expanded && window.innerWidth < 900)
      document.documentElement.style.overflow = 'hidden'
    else if (typeof document !== "undefined")
      document.documentElement.style.overflow = 'auto'

    setExpandMenu(expanded)
  }

  let navbarShrinked = false
  if (typeof window !== "undefined" && window.scrollY > 0)
    navbarShrinked = true

  const toggleExpanded = (key: string) => {
    const expanded = { ...expandedSubmenu }
    expanded[key] = !expandedSubmenu[key]
    setExpandedSubmenu(expanded)
  }

  useEffect(() => {
    setTimeout(() => setRerender(!rerender), 1000)
  }, [rerender])
  

  return (
    <nav className={`${styles.navbar} ${expandMenu ? styles.navbarExpanded : ''} ${navbarShrinked ? styles.navbarShrinked : ''}`} data-cy="navbar">
      <div className={styles.logoWrapper}>
        <Link href="/" passHref>
          <div>
            <Image src={logo} 
              className={styles.logo} 
              layout="intrinsic" 
              width={140} 
              height={80}
              alt="Konduit. logo"
              onClick={() => setExpanded(false)}
              priority/>
          </div>
        </Link>
        <div className={styles.expandBtn} onClick={() => setExpanded(!expandMenu)}>
          {expandMenu ?
            <X size={32} color={"black"} /> :
            <Menu size={32} color={"black"} />
          }
          </div>   
        </div>   
      <ul>
        {elements.map(el => el._type === 'navgroup' ?
          <li key={el._key} className={expandedSubmenu[el._key] ? styles.expandedSubmenu : styles.collapsedSubmenu}>
            <span onClick={() => toggleExpanded(el._key)}>{el.title}</span>
            <AnimateHeight height={expandedSubmenu[el._key] ? 'auto' : '0%'} animateOpacity>
              <div className={styles.submenu}>
                <ul>
                  {
                    el.items.map(subel => (
                      <li key={subel.title} onClick={() => setExpanded(false)}>
                        <Link href={`/${subel.slug}`} passHref>{subel.title}</Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </AnimateHeight>
          </li> 
          :
          <li key={el._key} onClick={() => setExpanded(false)}>
            <Link href={`/${el.slug}`} passHref>{el.title}</Link>
          </li>
        )}
        <li onClick={() => setExpanded(false)} className={styles.btnlogin}><Link href="/profile" passHref>Logg inn</Link></li>
      </ul>
    </nav>
  )
}
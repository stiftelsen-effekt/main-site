import { NextPage } from "next";
import React, { ReactElement } from "react";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import styles from '../styles/Layout.module.css'

export const Layout: React.FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
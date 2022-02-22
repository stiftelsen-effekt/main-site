import React from "react";
import { Footer } from "../footer";
import { Navbar } from "./navbar";
import styles from '../../styles/Layout.module.css'
import { LayoutElement } from "../../types";

export const Layout: LayoutElement = ({ children }) => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
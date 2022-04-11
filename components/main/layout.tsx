import React from 'react'
import { Footer } from '../footer'
import { Navbar } from './navbar'
import styles from '../../styles/Layout.module.css'
import { LayoutElement } from '../../types'
import { GiButton } from '../give-now-button/gi-button'
export const Layout: LayoutElement = ({ children }) => {
  return (
    <div className={styles.container}>
      <GiButton url="/donations" darkMode={false} />
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

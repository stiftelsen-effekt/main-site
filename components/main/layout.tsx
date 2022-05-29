import React, { useState } from 'react'
import { Footer } from '../footer'
import styles from '../../styles/Layout.module.css'
import { LayoutElement } from '../../types'
import { GiButton } from '../give-now-button/gi-button'
import { WidgetPane } from '../elements/widgetpane'
export const Layout: LayoutElement = ({ children }) => {
  const [widgetOpen, setWidgetOpen] = useState(false)

  return (
    <div className={styles.container}>
      <GiButton inverted={false} onClick={() => setWidgetOpen(true)} />
      <WidgetPane open={widgetOpen} onClose={() => setWidgetOpen(false)} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

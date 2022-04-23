import React from 'react'
import styles from '../styles/SectionContainer.module.css'

interface Section {
  heading: string
  inverted?: boolean
}

export const SectionContainer: React.FC<Section> = ({
  heading,
  inverted,
  children,
}) => {
  let background
  inverted ? (background = styles.bg__black) : null

  return (
    <section className={styles.section__container + ' ' + background}>
      <h4 className={styles.section__heading}>{heading}</h4>
      <div className={styles.section__content}>{children}</div>
    </section>
  )
}

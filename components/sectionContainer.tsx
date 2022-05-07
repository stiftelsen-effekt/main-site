import React from 'react'
import styles from '../styles/SectionContainer.module.css'

interface Section {
  heading?: string
  inverted?: boolean
  nodivider?: boolean
}

export const SectionContainer: React.FC<Section> = ({
  heading,
  inverted,
  nodivider,
  children,
}) => {
  let background
  let dividerLine = styles.divider

  inverted ? (background = styles.inverted) : null
  nodivider ? (dividerLine = '') : null

  return (
    <section className={styles.section__container + ' ' + background}>
      <h2 className={styles.section__heading + ' ' + dividerLine}>{heading}</h2>
      <div className={styles.section__content}>{children}</div>
    </section>
  )
}

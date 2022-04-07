import React from 'react'
import styles from '../styles/SectionContainer.module.css'

interface Section {
  heading: string
}

export const SectionContainer: React.FC<Section> = ({ heading, children }) => {
  return (
    <section className={styles.section__container}>
      <h4 className={styles.section__heading}>{heading}</h4>
      <div className={styles.section__content}>{children}</div>
    </section>
  )
}

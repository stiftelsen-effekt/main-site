import React from 'react'
import styles from '../styles/Testemonial.module.css'

export interface Testimony {
  quotee: string
  quoteeBackground: string
  quote: string
  source?: string
}

export const Testimonial: React.FC<Testimony> = ({
  quotee,
  quote,
  quoteeBackground,
  source,
}) => {
  return (
    <section className={styles.testemonial}>
      <h2 className={styles.testemonial__quote}>
        <q>{quote}</q>
      </h2>
      <div className={styles.testemonial__image}>
        <img src={source} alt={quotee} />
      </div>
      <div className={styles.testemonial__bio}>
        <p>{quotee}</p>
        <p> &#x21b3; {quoteeBackground}</p>
      </div>
    </section>
  )
}

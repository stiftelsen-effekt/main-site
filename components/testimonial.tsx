import React from 'react'
import styles from '../styles/Testemonial.module.css'
import Image from 'next/image'

export interface Testimony {
  quotee: string
  quoteeBackground: string
  quote: string
  imageUrl: string
}

export const Testimonial: React.FC<Testimony> = ({
  quotee,
  quote,
  quoteeBackground,
  imageUrl,
}) => {
  return (
    <section className={styles.testemonial}>
      <h2 className={styles.testemonial__quote}>
        <q>{quote}</q>
      </h2>
      <div className={styles.testemonial__image}>
        <Image src={imageUrl} alt={quotee} width={140} height={140} />
      </div>
      <div className={styles.testemonial__bio}>
        <p>{quotee}</p>
        <p> &#x21b3; {quoteeBackground}</p>
      </div>
    </section>
  )
}

import React from 'react'
import styles from '../styles/Testemonial.module.css'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { ResponsiveImage } from "./elements/responsiveimage"

export interface Testimony {
  quotee: string
  quoteeBackground: string
  quote: string
  image: SanityImageSource
}

export const Testimonial: React.FC<Testimony> = ({
  quotee,
  quote,
  quoteeBackground,
  image,
}) => {
  return (
    <section className={styles.testimonial}>
      <p className={styles.testemonial__quote}>“{quote}”</p>
      <div className={styles.testemonial__image}>
        <ResponsiveImage image={image} />
      </div>
      <div className={styles.testimonial__bio}>
        <p>{quotee}</p>
        <p> &#x21b3; {quoteeBackground}</p>
      </div>
    </section>
  )
}

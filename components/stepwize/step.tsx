import React from 'react'
import styles from '../../styles/Stepwize.module.css'

interface EachStep {
  heading: string
  subheading: string
  description: string
}

export const Step: React.FC<EachStep> = ({
  heading,
  subheading,
  description,
}) => {
  return (
    <div className={styles.step}>
      <h1 className={styles.step__heading}>{heading}</h1>
      <h3 className={styles.step__subheading}>{subheading}</h3>
      <p className={styles.step__description}>{description}</p>
    </div>
  )
}

import React from 'react'
import styles from '../styles/Testemonial.module.css'

interface Testemony {
  quotee: string
  quoteeBackground: string
  quote: string
}

export const Testemonial: React.FC<Testemony> = ({
  quotee,
  quote,
  quoteeBackground,
}) => {
  return (
    <section>
      <h2 className="testemonial__quote">
        <span>Testemonial</span>
      </h2>
      <div className={styles.round}></div>
    </section>
  )
}

import React from 'react'
import styles from '../../styles/GiButton.module.css'

export const GiButton: React.FC<{ inverted: boolean, onClick: () => void }> = ({ inverted, onClick }) => {
  return (
    <div className={`${styles.gibutton} ${inverted ? styles.gibuttoninverted : null}`} onClick={onClick}>
      Gi.
    </div>
  )
}

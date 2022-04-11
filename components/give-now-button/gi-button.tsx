import React from 'react'
import styles from '../../styles/GiButton.module.css'
import Link from 'next/link'

interface giBtn {
  url: string
}

export const GiButton: React.FC<giBtn> = ({ url }) => {
  return (
    <Link href={url} passHref>
      <div className={styles.gibutton}>
        <svg viewBox="0 0 100 100" fill="black">
          <g>
            <circle cx="50%" cy="50%" r="49.5" />
            <text
              className={styles.gibutton__text}
              x="52%"
              y="65%"
              textAnchor="middle"
              alignment-baseline="central"
              fill="white"
            >
              Gi.
            </text>
          </g>
        </svg>
      </div>
    </Link>
  )
}

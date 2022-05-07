import React from 'react'
import styles from '../../styles/GiButton.module.css'
import Link from 'next/link'

interface giBtn {
  url: string
  darkMode?: boolean
}

export const GiButton: React.FC<giBtn> = ({ url, darkMode }) => {
  let color = 'white'
  let bg = 'black'

  function colorSwap(forground: string, background: string) {
    color = forground
    bg = background
  }

  darkMode == true ? colorSwap('black', 'white') : null

  return (
    <Link href={url} passHref>
      <div className={styles.gibutton}>
        <svg viewBox="0 0 100 100" fill={bg} stroke={color}>
          <g>
            <circle cx="50%" cy="50%" r="49.5" />
            <text
              className={styles.gibutton__text}
              x="52%"
              y="65%"
              textAnchor="middle"
              alignmentBaseline="central"
              fill={color}
            >
              Gi.
            </text>
          </g>
        </svg>
      </div>
    </Link>
  )
}

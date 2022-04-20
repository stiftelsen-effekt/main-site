import React from 'react'
import styles from '../../styles/GiveWidgetDummy.module.css'

export const GiveWidgetDummy: React.FC = () => {
  return (
    <aside>
      <form>
        <input type="radio" name="fast" id="fast" />
        <label htmlFor="fast">Gi en fast månedlig sum</label>
        <br />
        <input type="radio" name="engangs" id="engangs" />
        <label htmlFor="fast">Gi et engangsbeløp</label>
        <button></button>
      </form>
    </aside>
  )
}

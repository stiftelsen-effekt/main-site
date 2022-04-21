import React from 'react'
import styles from '../../styles/GiveWidgetDummy.module.css'

export const GiveWidgetDummy: React.FC = () => {
  return (
    <aside className={styles.donations__widget}>
      <form>
        <div className={styles.donationtype}>
          <label htmlFor="fast">
            <input type="radio" name="fastdonasjon" id="fast" />
            Gi en fast månedlig sum
          </label>
          <hr />

          <label htmlFor="engangs">
            <input type="radio" name="engangsdonasjon" id="engangs" />
            Gi et engangsbeløp
          </label>
        </div>

        <div className={styles.paymethod}>
          <button className={styles.paymethod__btn + ' ' + styles.bank}>
            BANK
          </button>
          <button className={styles.paymethod__btn + ' ' + styles.vipps} />
          <button className={styles.paymethod__btn + ' ' + styles.paypal} />
        </div>
      </form>
    </aside>
  )
}

import React from 'react'
import { Step } from './step'
import styles from '../../styles/Stepwize.module.css'

export const Stepwize: React.FC = () => {
  return (
    <div className={styles.stepwize__container}>
      <Step
        heading="01."
        subheading="Deg"
        description="Velg blant våre organisasjoner, eller overlat fordelingen til oss, og gi
        valgfritt beløp via Vipps, PayPal, AvtaleGiro eller bankoverføring."
      />
      <Step
        heading="02."
        subheading="Konduit.no"
        description="Vi dekker transaksjonskostnader slik at 100 % av din donasjon går videre. Og vi sørger for at du får skattefradrag om du ønsker det."
      />
      <Step
        heading="03."
        subheading="Organisasjonene"
        description="Utfører mer effektiv bistand som ikke ville skjedd uten ditt bidrag."
      />
    </div>
  )
}

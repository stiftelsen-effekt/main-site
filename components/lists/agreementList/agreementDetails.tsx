import React, { useState } from "react";
import style from "../../../styles/AgreementDetails.module.css"
import { Distribution } from "../../../models";
import { DistributionController } from "../../elements/distribution";
import { DatePickerInput } from "../../elements/datepickerinput";

export const AgreementDetails: React.FC<{ inputSum: number, inputDate: number, inputDistribution: Distribution }> = ({ inputSum, inputDate, inputDistribution }) => {
  const [distribution, setDistribution] = useState<Distribution>(inputDistribution)
  const [date, setDate] = useState(inputDate)
  const [sum, setSum] = useState(inputSum.toFixed(0))
  
  return (
    <div className={style.wrapper}>
      <div className={style.distribution}>
        <DistributionController distribution={distribution} onChange={(dist) => setDistribution(dist)} />
      </div>
      <div className={style.values}>
        <DatePickerInput selected={date} onChange={(date) => setDate(date)} />
        <input type="text" defaultValue={sum} onChange={(e) => setSum(e.target.value)} />
      </div>
      <div className={style.actions}>
        <button className={style.button}>Avslutt avtale</button>
        <button className={style.button}>Lagre</button>
      </div>
    </div>
  )
}
import React, { useContext, useEffect, useState } from "react";
import style from "../../../styles/AgreementDetails.module.css"
import { Distribution } from "../../../models";
import { DistributionController } from "../../elements/distribution";
import { DatePickerInput } from "../../elements/datepickerinput";
import { toast, ToastContainer } from "react-toastify";
import { updateAvtaleagreementAmount, updateAvtaleagreementPaymentDay, updateAvtalegiroAgreementDistribution, updateVippsAgreementDay, updateVippsAgreementDistribution, updateVippsAgreementPrice } from "./_queries";
import { useAuth0, User } from "@auth0/auth0-react";
import { useSWRConfig } from "swr";

export const AgreementDetails: React.FC<{ type: 'vipps' | 'avtalegiro', inputSum: number, inputDate: number, inputDistribution: Distribution, endpoint: string }> = ({ type, inputSum, inputDate, inputDistribution, endpoint }) => {
  const { getAccessTokenSilently, user } = useAuth0()
  const { mutate } = useSWRConfig()
  const [distribution, setDistribution] = useState<Distribution>(inputDistribution)
  const [day, setDay] = useState(inputDate)
  const [sum, setSum] = useState(inputSum.toFixed(0))

  const save = async () => {
    const token = await getAccessTokenSilently()
    if (type == 'vipps') {
      const savedDistributionKID = await updateVippsAgreementDistribution(endpoint, distribution, token)
      const updatedDate = await updateVippsAgreementDay(endpoint, day, token)
      const updatedSum = await updateVippsAgreementPrice(endpoint, parseFloat(sum), token)
      if (savedDistributionKID != null && updatedDate !== null && updatedSum !== null) {
        successToast()
        mutate(`/donors/${(user as User)["https://konduit.no/user-id"]}/recurring/vipps/`)
      } else {
        failureToast()
      }
    } else if (type == 'avtalegiro') {
      const savedDistributionKID = await updateAvtalegiroAgreementDistribution(endpoint, distribution, token)
      const updatedDate = await updateAvtaleagreementPaymentDay(endpoint, day, token)
      const updatedSum = await updateAvtaleagreementAmount(endpoint, parseFloat(sum), token)
      if (savedDistributionKID != null && updatedDate !== null && updatedSum !== null) {
        successToast()
        mutate(`/donors/${(user as User)["https://konduit.no/user-id"]}/recurring/avtalegiro/`)
      } else {
        failureToast()
      }
    }
  }
  
  return (
    <div className={style.wrapper}>
      <div className={style.distribution}>
        <DistributionController distribution={distribution} onChange={(dist) => setDistribution(dist)} />
      </div>
      <div className={style.values}>
        <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
        <input type="text" defaultValue={sum} onChange={(e) => setSum(e.target.value)} />
      </div>
      <div className={style.actions}>
        <button className={style.button}>Avslutt avtale</button>
        <button className={style.button} onClick={() => save()}>Lagre</button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{width: "200px"}}
        />
    </div>
  )
}

const successToast = () => toast.success("Lagret");
const failureToast = () => toast.error("Noe gikk galt, prøv på nytt");
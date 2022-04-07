import style from "../../../styles/AgreementDetails.module.css"
import styles from "../../../styles/Lightbox.module.css"
import React, { useContext, useEffect, useState } from "react";
import { Distribution } from "../../../models";
import { DistributionController } from "../../elements/distribution";
import { DatePickerInput } from "../../elements/datepickerinput";
import { toast } from "react-toastify";
import {
  updateAvtaleagreementAmount,
  updateAvtaleagreementPaymentDay,
  updateAvtalegiroAgreementDistribution,
  updateVippsAgreementDay,
  updateVippsAgreementDistribution,
  updateVippsAgreementPrice,
} from "./_queries";
import { useAuth0, User } from "@auth0/auth0-react";
import { useSWRConfig } from "swr";
import { AlertCircle, Check } from "react-feather";
import { Lightbox } from "../../elements/lightbox";


export function daysInMonth(month:number, year:number) {
  return new Date(year, month, 0).getDate()
}

export function checkPaymentDate(today: Date, currentPaymentDate: number) {
  let paymentDate;
  let daysMonth: number = daysInMonth(today.getMonth() + 1 , today.getFullYear())
  let todaysDate = today.getDate()
  if(currentPaymentDate == 0){
    paymentDate = daysMonth
  } else {
    paymentDate = currentPaymentDate
  }

  let daysBetween = paymentDate - todaysDate
  if(daysBetween >= 0){
    return (daysBetween <= 6) ? true : false
  } else {
    return (daysMonth - todaysDate + paymentDate <= 6) ? true : false
  }
}

export const AgreementDetails: React.FC<{
  type: "Vipps" | "AvtaleGiro";
  inputSum: number;
  inputDate: number;
  inputDistribution: Distribution;
  endpoint: string;
}> = ({ type, inputSum, inputDate, inputDistribution, endpoint }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { mutate } = useSWRConfig();
  const [distribution, setDistribution] =
    useState<Distribution>(inputDistribution);
  const [day, setDay] = useState(inputDate);
  const [sum, setSum] = useState(inputSum.toFixed(0));

const [lightboxOpen, setLightboxOpen] = useState(false);


/**
 * Closes the lightbox.
 */
const onCancel = () => {setLightboxOpen(false)};

/**
 * Closes the lightbox.
 */
const onConfirm = () => {setLightboxOpen(false)};

/**
 * Saves an agreement if any changes have been made. 
 * @returns a toast indicating whether the changes are saved or not.
 */
  const save = async () => {
    const token = await getAccessTokenSilently();
    if (type == "Vipps") {
      const savedDistributionKID = await updateVippsAgreementDistribution(
        endpoint,
        distribution,
        token
      );
      const updatedDate = await updateVippsAgreementDay(endpoint, day, token);
      const updatedSum = await updateVippsAgreementPrice(
        endpoint,
        parseFloat(sum),
        token
      );
      if (
        savedDistributionKID != null &&
        updatedDate !== null &&
        updatedSum !== null
      ) {
        successToast();
        mutate(
          `/donors/${
            (user as User)["https://konduit.no/user-id"]
          }/recurring/vipps/`
        );
      } else {
        failureToast();
      }
    } else if (type == "AvtaleGiro") {
      const savedDistributionKID = await updateAvtalegiroAgreementDistribution(
        endpoint,
        distribution,
        token
      );
      const updatedDate = await updateAvtaleagreementPaymentDay(
        endpoint,
        day,
        token
      );
      const updatedSum = await updateAvtaleagreementAmount(
        endpoint,
        parseFloat(sum) * 100,
        token 
      );
      if (
        savedDistributionKID != null &&
        updatedDate !== null &&
        updatedSum !== null
      ) {
        successToast();
        mutate(
          `/donors/${
            (user as User)["https://konduit.no/user-id"]
          }/recurring/avtalegiro/`
        );
      } else {
        failureToast();
      }
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.distribution}>
        <DistributionController
          distribution={distribution}
          onChange={(dist) => setDistribution(dist)}
        />
      </div>
      <div className={style.values}>
        <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
        <div>
        <input type="text" defaultValue={sum} onChange={(e) => setSum(e.target.value)}/>
        <span>kr</span>
        </div>
      </div>
      <div className={style.actions}>
        <button className={style.button} onClick={() => setLightboxOpen(true)}>Avslutt avtale</button>
        <button className={style.button} onClick={() => save()}>Lagre</button>
      </div>
      <Lightbox open={lightboxOpen} onConfirm={onConfirm} onCancel={onCancel}>
        <div className={styles.textWrapper}>
          <h2>Avslutt avtale</h2>
          <p>Hvis du avslutter din betalingsavtale hos oss vil vi slutte å trekke deg.</p>
          {checkPaymentDate(new Date(), day) ? <p>Dersom du har en avtalegiro avtale og den har trekkdato nærmere enn 6 dager frem i tid har vi allerede sendt melding til banksystemene om å trekke deg. Dette skyldes tregheter i registrering av trekk hos bankene. Om du ønsker refusjon på denne donasjonen kan du ta kontakt på donasjon@gieffektivt.no</p> : null }
        </div>
      </Lightbox>
    </div>
  );
};

const successToast = () =>
  toast.success("Lagret", { icon: <Check size={24} color={"black"} /> });
const failureToast = () =>
  toast.error("Noe gikk galt", {
    icon: <AlertCircle size={24} color={"black"} />,
  });

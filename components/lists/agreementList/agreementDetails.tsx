import style from "../../../styles/AgreementDetails.module.css"
import styles from "../../../styles/Lightbox.module.css"
import React, { useContext, useEffect, useState } from "react";
import { Distribution } from "../../../models";
import { DistributionController } from "../../elements/distribution";
import { DatePickerInput } from "../../elements/datepickerinput";
import { toast } from "react-toastify";
import {
  cancelAvtaleGiroAgreement,
  cancelVippsAgreement,
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

  const cancel = async () => {
    setLightboxOpen(false);
    const token = await getAccessTokenSilently();
    if (type === "Vipps") {
      const cancelled = await cancelVippsAgreement(endpoint, token)
      if (cancelled) {
        successToast()
        mutate(
          `/donors/${
            (user as User)["https://konduit.no/user-id"]
          }/recurring/vipps/`
        );
      } else {
        failureToast()
      }
    } else if (type === "AvtaleGiro") {
      const cancelled = await cancelAvtaleGiroAgreement(endpoint, token)
      if (cancelled) {
        successToast()
        mutate(
          `/donors/${
            (user as User)["https://konduit.no/user-id"]
          }/recurring/avtalegiro/`
        );
      } else {
        failureToast()
      }
    }
  }

  return (
    <div className={style.wrapper} data-cy="agreement-list-details">
      <div className={style.distribution}>
        <DistributionController
          distribution={distribution}
          onChange={(dist) => setDistribution(dist)}
        />
      </div>
      <div className={style.values}>
        <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
        <div>
        <input type="text" defaultValue={sum} onChange={(e) => setSum(e.target.value)} data-cy="agreement-list-amount-input"/>
        <span>kr</span>
        </div>
      </div>
      <div className={style.actions}>
        <button className={style.button} onClick={() => setLightboxOpen(true)} data-cy="btn-cancel-agreement">Avslutt avtale</button>
        <button className={style.button} onClick={() => save()} data-cy="btn-save-agreement">Lagre</button>
      </div>
      <Lightbox open={lightboxOpen} onConfirm={() => cancel()} onCancel={() => setLightboxOpen(false)}>
        <div className={styles.textWrapper}>
          <h2>Avslutt avtale</h2>
          <p>Hvis du avslutter din betalingsavtale hos oss vil vi slutte å trekke deg.</p>
          <p>Dersom du har en avtalegiro avtale og den har trekkdato nærmere enn 6 dager frem i tid har vi allerede sendt melding til banksystemene om å trekke deg. Dette skyldes tregheter i registrering av trekk hos bankene. Om du ønsker refusjon på denne donasjonen kan du ta kontakt på donasjon@gieffektivt.no</p>
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

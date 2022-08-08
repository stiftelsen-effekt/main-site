import React, { useContext, useEffect, useState } from "react";
import { Distribution } from "../../../../../models";
import { DistributionController } from "../../Distribution";
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
import { AlertCircle, Check, Info } from "react-feather";
import { DatePickerInput } from "../../../../shared/components/DatePicker/DatePickerInput";
import style from "./AgreementDetails.module.scss";
import { EffektButton } from "../../../../shared/components/EffektButton/EffektButton";
import { Lightbox } from "../../../../shared/components/Lightbox/Lightbox";
import { RadioButton } from "../../../../main/widget/components/panes/Forms.style";
import { ShareType } from "../../../../main/widget/types/Enums";
import { InfoParagraph } from "../../../../main/widget/components/panes/DonationPane/DonationPane.style";
import { RadioButtonGroup } from "../../../../shared/components/RadioButton/RadioButtonGroup";

/**
 * Gets the number of days in a month in a year
 * @param {number} month - The month to check number of days of, january = 1
 * @param {number} year - The year to check days of month
 * @returns {number} The number of days in given month in given year
 */
export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

/**
 * Checks if paymentdate is within 6 days from now
 * @param {Date} today - Todays date
 * @param {number} currentPaymentDate - The paymentDate registered on agreement
 * @returns {boolean} true if paymentdate is within 6 days from today, false if not
 */
export function checkPaymentDate(today: Date, currentPaymentDate: number) {
  let paymentDate;
  let daysMonth: number = daysInMonth(today.getMonth() + 1, today.getFullYear());
  let todaysDate = today.getDate();
  if (currentPaymentDate == 0) {
    paymentDate = daysMonth;
  } else {
    paymentDate = currentPaymentDate;
  }

  let daysBetween = paymentDate - todaysDate;
  if (daysBetween >= 0) {
    return daysBetween <= 6 ? true : false;
  } else {
    return daysMonth - todaysDate + paymentDate <= 6 ? true : false;
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
  const [distribution, setDistribution] = useState<Distribution>(
    JSON.parse(JSON.stringify(inputDistribution)),
  );
  const [day, setDay] = useState(inputDate);
  const [sum, setSum] = useState(inputSum.toFixed(0));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadingChanges, setLoadingChanges] = useState(false);

  const [shareType, setShareType] = useState<ShareType>(ShareType.CUSTOM);

  /**
   * Saves an agreement if any changes have been made.
   * @returns a toast indicating whether the changes are saved or not.
   */
  /**
   * Saves an agreement if any changes have been made.
   * @returns a toast indicating whether the changes are saved or not.
   */
  const save = async () => {
    const token = await getAccessTokenSilently();
    const distributionChanged = JSON.stringify(distribution) !== JSON.stringify(inputDistribution);
    const sumChanged = parseFloat(sum) !== inputSum;
    const dayChanged = day !== inputDate;
    const distSum = distribution.organizations.reduce(
      (acc, curr) => acc + parseFloat(curr.share),
      0,
    );

    if (distSum !== 100 || parseFloat(sum) < 1) {
      invalidInputToast();
      return;
    }

    if (!distributionChanged && !dayChanged && !sumChanged) {
      noChangesToast();
      return;
    }

    setLoadingChanges(true);

    if (type == "Vipps") {
      let result = null;

      if (distributionChanged) {
        result = await updateVippsAgreementDistribution(
          endpoint,
          { kid: distribution.kid, organizations: [] },
          token,
        );
      }

      if (dayChanged) {
        result = await updateVippsAgreementDay(endpoint, day, token);
      }

      if (sumChanged) {
        result = await updateVippsAgreementPrice(endpoint, parseFloat(sum), token);
      }

      if (result != null) {
        successToast();
        mutate(`/donors/${(user as User)["https://gieffektivt.no/user-id"]}/recurring/vipps/`);
        setLoadingChanges(false);
      } else {
        failureToast();
        setLoadingChanges(false);
      }
    } else if (type == "AvtaleGiro") {
      let result = null;

      if (distributionChanged) {
        result = await updateAvtalegiroAgreementDistribution(
          endpoint,
          { kid: distribution.kid, organizations: [] },
          token,
        );
      }

      if (dayChanged) {
        result = await updateAvtaleagreementPaymentDay(endpoint, day, token);
      }

      if (sumChanged) {
        result = await updateAvtaleagreementAmount(endpoint, parseFloat(sum) * 100, token);
      }

      if (result !== null) {
        successToast();
        mutate(`/donors/${(user as User)["https://gieffektivt.no/user-id"]}/recurring/avtalegiro/`);
        setLoadingChanges(false);
      } else {
        failureToast();
        setLoadingChanges(false);
      }
    }
  };

  const cancel = async () => {
    setLightboxOpen(false);
    const token = await getAccessTokenSilently();
    if (type === "Vipps") {
      const cancelled = await cancelVippsAgreement(endpoint, token);
      if (cancelled) {
        successToast();
        mutate(`/donors/${(user as User)["https://gieffektivt.no/user-id"]}/recurring/vipps/`);
      } else {
        failureToast();
      }
    } else if (type === "AvtaleGiro") {
      const cancelled = await cancelAvtaleGiroAgreement(endpoint, token);
      if (cancelled) {
        successToast();
        mutate(`/donors/${(user as User)["https://gieffektivt.no/user-id"]}/recurring/avtalegiro/`);
      } else {
        failureToast();
      }
    }
  };

  return (
    <div className={style.wrapper} data-cy="agreement-list-details">
      <div className={style.distribution}>
        <RadioButtonGroup
          options={[
            { title: "Smart fordeling", value: ShareType.STANDARD, data_cy: "radio-smart-share" },
            {
              title: "Velg fordeling selv",
              value: ShareType.CUSTOM,
              data_cy: "radio-custom-share",
            },
          ]}
          selected={shareType}
          onSelect={(option) => {
            setShareType(option as ShareType);
          }}
        />
        {shareType === ShareType.STANDARD && (
          <InfoParagraph>
            Smart fordeling sørger for at du kontinuerlig benytter deg av de aller siste og mest
            oppdaterte tallene for hvordan du kan få størst mulig effekt av donasjonen din.{" "}
          </InfoParagraph>
        )}
        {shareType === ShareType.CUSTOM && (
          <DistributionController
            distribution={distribution}
            onChange={(dist) => setDistribution(dist)}
          />
        )}
      </div>
      <div className={style.values}>
        <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
        <div>
          <input
            type="text"
            defaultValue={inputSum}
            onChange={(e) => setSum(e.target.value)}
            data-cy="agreement-list-amount-input"
          />
          <span>kr</span>
        </div>
      </div>
      <div className={style.actions}>
        <EffektButton onClick={() => setLightboxOpen(true)} cy="btn-cancel-agreement">
          Avslutt avtale
        </EffektButton>
        <EffektButton onClick={() => save()} disabled={loadingChanges} cy="btn-save-agreement">
          {!loadingChanges ? "Lagre" : "Laster..."}
        </EffektButton>
      </div>
      <Lightbox
        open={lightboxOpen}
        onConfirm={() => cancel()}
        onCancel={() => setLightboxOpen(false)}
      >
        <div className={style.textWrapper}>
          <h2>Avslutt avtale</h2>
          <p>Hvis du avslutter din betalingsavtale hos oss vil vi slutte å trekke deg.</p>
          {checkPaymentDate(new Date(), day) ? (
            <p>
              Denne avtalegiro avtalen har trekkdato nærmere enn 6 dager frem i tid. Vi allerede
              sendt melding til banksystemene om å trekke deg. Dette skyldes tregheter i
              registrering av trekk hos bankene. Om du ønsker refusjon på denne donasjonen kan du ta
              kontakt på donasjon@gieffektivt.no
            </p>
          ) : null}
        </div>
      </Lightbox>
    </div>
  );
};

const successToast = () => toast.success("Lagret", { icon: <Check size={24} color={"black"} /> });
const failureToast = () =>
  toast.error("Noe gikk galt", {
    icon: <AlertCircle size={24} color={"black"} />,
  });
const noChangesToast = () =>
  toast.error("Ingen endringer", {
    icon: <Info size={24} color={"black"} />,
  });
const invalidInputToast = () =>
  toast.error("Ugyldig data inntastet", {
    icon: <AlertCircle size={24} color={"black"} />,
  });

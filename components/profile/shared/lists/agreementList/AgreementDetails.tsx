import React, { useState } from "react";
import { Distribution, TaxUnit } from "../../../../../models";
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
import { TaxUnitSelector } from "../../TaxUnitSelector/TaxUnitSelector";
import { TaxUnitCreateModal } from "../../TaxUnitModal/TaxUnitCreateModal";
import { EffektCheckbox } from "../../../../shared/components/EffektCheckbox/EffektCheckbox";
import AnimateHeight from "react-animate-height";
import { checkPaymentDate } from "../../../../../util/dates";
import { getUserId } from "../../../../../lib/user";

export const AgreementDetails: React.FC<{
  type: "Vipps" | "AvtaleGiro";
  inputSum: number;
  inputDate: number;
  inputDistribution: Distribution;
  endpoint: string;
}> = ({ type, inputSum, inputDate, inputDistribution, endpoint }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { mutate } = useSWRConfig();
  const [distribution, setDistribution] = useState<Distribution>({ ...inputDistribution });
  const [day, setDay] = useState(inputDate);
  const [sum, setSum] = useState(inputSum.toFixed(0));

  const [addTaxUnitOpen, setAddTaxUnitOpen] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadingChanges, setLoadingChanges] = useState(false);

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
    const distSum = distribution.shares.reduce((acc, curr) => acc + parseFloat(curr.share), 0);

    if (distSum !== 100 || parseFloat(sum) < 1) {
      invalidInputToast();
      return;
    }

    if (!distributionChanged && !dayChanged && !sumChanged) {
      noChangesToast();
      return;
    }

    if (!user) throw new Error("User is not logged in");

    setLoadingChanges(true);

    if (type == "Vipps") {
      let result = null;

      if (distributionChanged) {
        result = await updateVippsAgreementDistribution(endpoint, distribution, token);
      }

      if (dayChanged) {
        result = await updateVippsAgreementDay(endpoint, day, token);
      }

      if (sumChanged) {
        result = await updateVippsAgreementPrice(endpoint, parseFloat(sum), token);
      }

      if (result != null) {
        successToast();
        mutate(`/donors/${getUserId(user)}/recurring/vipps/`);
        setLoadingChanges(false);
      } else {
        failureToast();
        setLoadingChanges(false);
      }
    } else if (type == "AvtaleGiro") {
      let result = null;

      if (distributionChanged) {
        result = await updateAvtalegiroAgreementDistribution(endpoint, distribution, token);
      }

      if (dayChanged) {
        result = await updateAvtaleagreementPaymentDay(endpoint, day, token);
      }

      if (sumChanged) {
        result = await updateAvtaleagreementAmount(endpoint, parseFloat(sum) * 100, token);
      }

      if (result !== null) {
        successToast();
        mutate(`/donors/${getUserId(user)}/recurring/avtalegiro/`);
        setLoadingChanges(false);
      } else {
        failureToast();
        setLoadingChanges(false);
      }
    }
  };

  const cancel = async () => {
    if (!user) throw new Error("User is not logged in");

    setLightboxOpen(false);
    const token = await getAccessTokenSilently();
    if (type === "Vipps") {
      const cancelled = await cancelVippsAgreement(endpoint, token);
      if (cancelled) {
        successToast();
        mutate(`/donors/${getUserId(user)}/recurring/vipps/`);
      } else {
        failureToast();
      }
    } else if (type === "AvtaleGiro") {
      const cancelled = await cancelAvtaleGiroAgreement(endpoint, token);
      if (cancelled) {
        successToast();
        mutate(`/donors/${getUserId(user)}/recurring/avtalegiro/`);
      } else {
        failureToast();
      }
    }
  };

  if (!distribution.shares) {
    return (
      <div className={style.errorWrapper}>
        <p>Det oppstod en feil. Vennligst prøv igjen senere eller ta kontakt med oss.</p>
      </div>
    );
  } else {
    return (
      <div className={style.wrapper} data-cy="agreement-list-details">
        <div className={style.values}>
          <div>
            <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
          </div>
          <div>
            <input
              type="text"
              defaultValue={inputSum}
              onChange={(e) => setSum(e.target.value)}
              data-cy="agreement-list-amount-input"
            />
            <span>kr</span>
          </div>
          <TaxUnitSelector
            selected={distribution.taxUnit?.archived === null ? distribution.taxUnit : null}
            onChange={(unit) => setDistribution({ ...distribution, taxUnit: unit })}
            onAddNew={() => setAddTaxUnitOpen(true)}
          />
          <EffektCheckbox
            checked={distribution.standardDistribution}
            onChange={(standard: boolean) =>
              setDistribution({ ...distribution, standardDistribution: standard })
            }
          >
            Smart fordeling
          </EffektCheckbox>
        </div>

        <AnimateHeight
          height={!distribution.standardDistribution ? "auto" : 0}
          animateOpacity={true}
        >
          <div className={style.distribution}>
            <DistributionController
              distribution={distribution}
              onChange={(dist) => setDistribution(dist)}
            />
          </div>
        </AnimateHeight>

        <div className={style.actions}>
          <EffektButton onClick={() => setLightboxOpen(true)} cy="btn-cancel-agreement">
            Avslutt avtale
          </EffektButton>
          <EffektButton onClick={() => save()} disabled={loadingChanges} cy="btn-save-agreement">
            {!loadingChanges ? "Lagre" : "Laster..."}
          </EffektButton>
        </div>

        {addTaxUnitOpen && (
          <TaxUnitCreateModal
            open={addTaxUnitOpen}
            onFailure={() => {}}
            onSuccess={(unit: TaxUnit) => {
              setDistribution({ ...distribution, taxUnit: unit });
              setAddTaxUnitOpen(false);
            }}
            onClose={() => setAddTaxUnitOpen(false)}
          />
        )}
        <Lightbox
          open={lightboxOpen}
          onConfirm={() => cancel()}
          onCancel={() => setLightboxOpen(false)}
        >
          <div className={style.textWrapper}>
            <h5>Avslutt avtale</h5>
            <p>Hvis du avslutter din betalingsavtale hos oss vil vi slutte å trekke deg.</p>
            {checkPaymentDate(new Date(), day) ? (
              <p>
                Denne avtalegiro avtalen har trekkdato nærmere enn 6 dager frem i tid. Vi allerede
                sendt melding til banksystemene om å trekke deg. Dette skyldes tregheter i
                registrering av trekk hos bankene. Om du ønsker refusjon på denne donasjonen kan du
                ta kontakt på donasjon@gieffektivt.no
              </p>
            ) : null}
          </div>
        </Lightbox>
      </div>
    );
  }
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

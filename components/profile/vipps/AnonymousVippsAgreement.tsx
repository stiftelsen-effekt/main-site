import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { Check, AlertCircle, Info } from "react-feather";
import { toast } from "react-toastify";
import { Distribution } from "../../../models";
import { DatePickerInput } from "../../shared/components/DatePicker/DatePickerInput";
import { EffektButton } from "../../shared/components/EffektButton/EffektButton";
import { EffektCheckbox } from "../../shared/components/EffektCheckbox/EffektCheckbox";
import { Lightbox } from "../../shared/components/Lightbox/Lightbox";
import { DistributionController } from "../shared/DistributionCauseAreaInput/Distribution";
import {
  updateAnonymousVippsAgreementDistribution,
  cancelAnonymousVippsAgreement,
  updateAnonymousVippsAgreementDay,
  updateAnonymousVippsAgreementPrice,
} from "../shared/lists/agreementList/_queries";
import style from "./AnonymousVippsAgreement.module.scss";
import { SumInput } from "../shared/SumInput/SumInput";

export const AnonymousVippsAgreement: React.FC<{
  inputSum: number;
  inputDate: number;
  inputDistribution: Distribution;
  endpoint: string;
}> = ({ inputSum, inputDate, inputDistribution, endpoint }) => {
  const [distribution, setDistribution] = useState<Distribution>(inputDistribution);
  const [day, setDay] = useState(inputDate);
  const [sum, setSum] = useState(inputSum.toFixed(0));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadingChanges, setLoadingChanges] = useState(false);

  /**
   * Saves an agreement if any changes have been made.
   * @returns a toast indicating whether the changes are saved or not.
   */
  const save = async () => {
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

    setLoadingChanges(true);

    let result = null;
    let errorOccurred = false;

    try {
      if (distributionChanged) {
        result = await updateAnonymousVippsAgreementDistribution(endpoint, distribution);
        if (!result) {
          errorOccurred = true;
        }
      }

      if (dayChanged) {
        result = await updateAnonymousVippsAgreementDay(endpoint, day);
        if (!result) {
          errorOccurred = true;
        }
      }

      if (sumChanged) {
        result = await updateAnonymousVippsAgreementPrice(endpoint, parseFloat(sum));
        if (!result) {
          errorOccurred = true;
        }
      }

      if (errorOccurred) {
        partialFailureToast();
      } else {
        successToast();
      }
    } catch (error) {
      console.error(error);
      failureToast();
    } finally {
      setLoadingChanges(false);
    }
  };

  const cancel = async () => {
    setLightboxOpen(false);
    const cancelled = await cancelAnonymousVippsAgreement(endpoint);
    if (cancelled) {
      successToast();
    } else {
      failureToast();
    }
  };

  if (typeof distribution === "undefined") {
    return (
      <div className={style.errorWrapper}>
        <p>Det oppstod en feil med denne avtalen. Vennligst ta kontakt med oss.</p>
      </div>
    );
  } else {
    return (
      <div className={style.wrapper}>
        <div className={style.values}>
          <div>
            <p>Trekkdag</p>
            <DatePickerInput selected={day} onChange={(date) => setDay(date)} />
          </div>
          <div>
            <p>Sum</p>
            <SumInput value={sum} label="kr" onChange={(value) => setSum(value)} />
          </div>
          <div>
            <EffektCheckbox
              checked={distribution.standardDistribution}
              onChange={(standard: boolean) =>
                setDistribution({ ...distribution, standardDistribution: standard })
              }
            >
              Smart fordeling
            </EffektCheckbox>
          </div>
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

        <Lightbox
          open={lightboxOpen}
          onConfirm={() => cancel()}
          onCancel={() => setLightboxOpen(false)}
        >
          <div className={style.textWrapper}>
            <h5>Avslutt avtale</h5>
            <p>Hvis du avslutter din betalingsavtale hos oss vil vi slutte å trekke deg.</p>
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
const partialFailureToast = () =>
  toast.error("Noen endringer feilet", {
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

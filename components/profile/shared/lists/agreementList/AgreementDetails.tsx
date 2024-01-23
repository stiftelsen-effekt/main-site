import React, { useEffect, useState } from "react";
import { Distribution, TaxUnit } from "../../../../../models";
import { DistributionController } from "../../DistributionCauseAreaInput/Distribution";
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
import { useAuth0 } from "@auth0/auth0-react";
import { useSWRConfig } from "swr";
import { AlertCircle, Check, Info } from "react-feather";
import style from "./AgreementDetails.module.scss";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../../shared/components/EffektButton/EffektButton";
import { Lightbox } from "../../../../shared/components/Lightbox/Lightbox";

import { checkPaymentDate } from "../../../../../util/dates";
import { getUserId } from "../../../../../lib/user";
import { AgreementSingleCauseAreaDetails } from "./singleCauseAreaDetails/AgreementSingleCauseAreaDetails";
import { useCauseAreas } from "../../../../../_queries";
import { AgreementMultipleCauseAreaDetails } from "./multipleCauseAreasDetails/AgreementMultipleCauseAreasDetails";

export const AgreementDetails: React.FC<{
  type: "Vipps" | "AvtaleGiro";
  inputSum: number;
  inputDate: number;
  inputDistribution: Distribution;
  taxUnits: TaxUnit[];
  endpoint: string;
}> = ({ type, inputSum, inputDate, inputDistribution, taxUnits, endpoint }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { mutate } = useSWRConfig();
  // Parse and stringify to make a deep copy of the object
  const [distribution, setDistribution] = useState<Distribution>(
    JSON.parse(JSON.stringify(inputDistribution)),
  );
  const [lastSavedDistribution, setLastSavedDistribution] = useState<Distribution>(
    JSON.parse(JSON.stringify(inputDistribution)),
  );
  const [day, setDay] = useState(inputDate);
  const [sum, setSum] = useState(inputSum);

  useEffect(() => {
    setLastSavedDistribution(JSON.parse(JSON.stringify(inputDistribution)));
  }, [inputDistribution]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadingChanges, setLoadingChanges] = useState(false);

  const {
    data: systemCauseAreas,
    error: causeAreasError,
    loading: causeAreasLoading,
    isValidating: causeAreasIsValidating,
  } = useCauseAreas(getAccessTokenSilently);

  const save = async () => {
    const token = await getAccessTokenSilently();
    const distributionChanged =
      JSON.stringify(distribution) !== JSON.stringify(lastSavedDistribution);
    const sumChanged = sum !== inputSum;
    const dayChanged = day !== inputDate;

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
        result = await updateVippsAgreementPrice(endpoint, sum, token);
      }

      if (result != null) {
        successToast();
        mutate(`/donors/${getUserId(user)}/recurring/vipps/`);
        setLoadingChanges(false);
        setLastSavedDistribution(JSON.parse(JSON.stringify(distribution)));
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
        result = await updateAvtaleagreementAmount(endpoint, sum * 100, token);
      }

      if (result !== null) {
        successToast();
        mutate(`/donors/${getUserId(user)}/recurring/avtalegiro/`);
        setLoadingChanges(false);
        setLastSavedDistribution(JSON.parse(JSON.stringify(distribution)));
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

  if (causeAreasLoading) {
    return (
      <div className={style.errorWrapper}>
        <p>Laster inn...</p>
      </div>
    );
  } else if (causeAreasError) {
    return (
      <div className={style.errorWrapper}>
        <p>Det oppstod en feil. Vennligst prøv igjen senere eller ta kontakt med oss.</p>
      </div>
    );
  } else if (!systemCauseAreas) {
    return (
      <div className={style.errorWrapper}>
        <p>Det oppstod en feil. Vennligst prøv igjen senere eller ta kontakt med oss.</p>
      </div>
    );
  }

  if (!distribution.causeAreas || distribution.causeAreas.some((c) => !c.organizations)) {
    return (
      <div className={style.errorWrapper}>
        <p>Det oppstod en feil. Vennligst prøv igjen senere eller ta kontakt med oss.</p>
      </div>
    );
  } else {
    return (
      <div className={style.wrapper} data-cy="agreement-list-details">
        {systemCauseAreas.length === 1 && (
          <AgreementSingleCauseAreaDetails
            distribution={distribution}
            setDistribution={setDistribution}
            day={day}
            setDay={setDay}
            sum={sum}
            setSum={setSum}
            taxUnits={taxUnits}
          ></AgreementSingleCauseAreaDetails>
        )}

        {systemCauseAreas.length > 1 && (
          <AgreementMultipleCauseAreaDetails
            systemCauseAreas={systemCauseAreas}
            distribution={distribution}
            setDistribution={setDistribution}
            day={day}
            setDay={setDay}
            sum={sum}
            setSum={setSum}
            taxUnits={taxUnits}
          ></AgreementMultipleCauseAreaDetails>
        )}

        <div className={style.actions}>
          <EffektButton
            variant={EffektButtonVariant.SECONDARY}
            onClick={() => setLightboxOpen(true)}
            cy="btn-cancel-agreement"
          >
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
            {checkPaymentDate(new Date(), day) && type === "AvtaleGiro" ? (
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

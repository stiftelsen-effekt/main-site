import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { Distribution, TaxUnit } from "../../../../../models";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../../shared/components/EffektButton/EffektButton";
import { Lightbox } from "../../../../shared/components/Lightbox/Lightbox";
import style from "./AgreementDetails.module.scss";
import {
  cancelAutoGiroAgreement,
  cancelAvtaleGiroAgreement,
  cancelVippsAgreement,
  updateAutoGiroAgreement,
  updateAvtaleagreementAmount,
  updateAvtaleagreementPaymentDay,
  updateAvtalegiroAgreementDistribution,
  updateVippsAgreementDay,
  updateVippsAgreementDistribution,
  updateVippsAgreementPrice,
} from "./_queries";

import { getUserId } from "../../../../../lib/user";
import { checkPaymentDate } from "../../../../../util/dates";
import { useCauseAreas } from "../../../../../_queries";
import { DatePickerInputConfiguration } from "../../../../shared/components/DatePicker/DatePickerInput";
import { failureToast, noChangesToast, successToast } from "../../toast";
import {
  AgreementMultipleCauseAreaDetails,
  AgreementMultipleCauseAreaDetailsConfiguration,
} from "./multipleCauseAreasDetails/AgreementMultipleCauseAreasDetails";
import { AgreementSingleCauseAreaDetails } from "./singleCauseAreaDetails/AgreementSingleCauseAreaDetails";

export type AgreementDetailsConfiguration = {
  save_button_text: string;
  cancel_button_text: string;
  date_selector_configuration: DatePickerInputConfiguration;
  loading_text: string;
  error_text: string;
  toasts_configuration: {
    success_text: string;
    failure_text: string;
    bad_input_failure_text?: string;
    no_changes_text: string;
  };
  agreement_cancel_lightbox: {
    title: string;
    text: string;
    withdrawal_warning_text: string;
  };
  distribution_configuration: AgreementMultipleCauseAreaDetailsConfiguration;
};

export const AgreementDetails: React.FC<{
  type: "Vipps" | "AvtaleGiro" | "AutoGiro";
  inputSum: number;
  inputDate: number;
  inputDistribution: Distribution;
  taxUnits: TaxUnit[];
  endpoint: string;
  configuration: AgreementDetailsConfiguration;
}> = ({ type, inputSum, inputDate, inputDistribution, taxUnits, endpoint, configuration }) => {
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

  useEffect(() => {
    // Check if the distribution has all the system cause areas
    // If not, add them
    if (systemCauseAreas && inputDistribution && inputDistribution.causeAreas) {
      const systemCauseAreaIds = systemCauseAreas.map((causeArea) => causeArea.id);
      const distributionCauseAreaIds = inputDistribution.causeAreas.map(
        (causeArea) => causeArea.id,
      );

      const missingCauseAreas = systemCauseAreaIds.filter(
        (id) => !distributionCauseAreaIds.includes(id),
      );

      if (missingCauseAreas.length > 0) {
        const newDistribution = JSON.parse(JSON.stringify(inputDistribution));
        missingCauseAreas.forEach((id) => {
          const systemCauseArea = systemCauseAreas.find((causeArea) => causeArea.id === id);
          if (systemCauseArea) {
            newDistribution.causeAreas.push({
              id: systemCauseArea.id,
              name: systemCauseArea.name,
              standardSplit: true,
              percentageShare: "0",
              organizations: systemCauseArea.organizations.map((org) => {
                return {
                  id: org.id,
                  percentageShare: org.standardShare?.toString() || "0",
                };
              }),
            });
          }
        });
        setDistribution(newDistribution);
      }
    }
  }, [systemCauseAreas, inputDistribution]);

  const save = async () => {
    const token = await getAccessTokenSilently();
    const distributionChanged =
      JSON.stringify(distribution) !== JSON.stringify(lastSavedDistribution);
    const sumChanged = sum !== inputSum;
    const dayChanged = day !== inputDate;

    if (!distributionChanged && !dayChanged && !sumChanged) {
      noChangesToast(configuration.toasts_configuration.no_changes_text);
      return;
    }

    if (!user) throw new Error("User is not logged in");

    setLoadingChanges(true);

    if (type == "Vipps") {
      let result: Awaited<
        ReturnType<
          | typeof updateVippsAgreementDistribution
          | typeof updateVippsAgreementDay
          | typeof updateVippsAgreementPrice
        >
      > = null;

      if (distributionChanged) {
        result = await updateVippsAgreementDistribution(endpoint, distribution, token);
      }

      if (dayChanged) {
        result = await updateVippsAgreementDay(endpoint, day, token);
      }

      if (sumChanged) {
        result = await updateVippsAgreementPrice(endpoint, sum, token);
      }

      if (result?.ok) {
        successToast(configuration.toasts_configuration.success_text);
        mutate(`/donors/${getUserId(user)}/recurring/vipps/`);
        setLoadingChanges(false);
        setLastSavedDistribution(JSON.parse(JSON.stringify(distribution)));
      } else {
        failureToast(
          (result?.status === 400 && configuration.toasts_configuration.bad_input_failure_text) ||
            configuration.toasts_configuration.failure_text,
        );
        setLoadingChanges(false);
      }
    } else if (type == "AvtaleGiro") {
      let result: Awaited<
        ReturnType<
          | typeof updateAvtalegiroAgreementDistribution
          | typeof updateAvtaleagreementPaymentDay
          | typeof updateAvtaleagreementAmount
        >
      > = null;

      if (distributionChanged) {
        result = await updateAvtalegiroAgreementDistribution(endpoint, distribution, token);
      }

      if (dayChanged) {
        result = await updateAvtaleagreementPaymentDay(endpoint, day, token);
      }

      if (sumChanged) {
        result = await updateAvtaleagreementAmount(endpoint, sum * 100, token);
      }

      if (result?.ok) {
        successToast(configuration.toasts_configuration.success_text);
        mutate(`/donors/${getUserId(user)}/recurring/avtalegiro/`);
        setLoadingChanges(false);
        setLastSavedDistribution(JSON.parse(JSON.stringify(distribution)));
      } else {
        failureToast(
          (result?.status === 400 && configuration.toasts_configuration.bad_input_failure_text) ||
            configuration.toasts_configuration.failure_text,
        );
        setLoadingChanges(false);
      }
    } else if (type == "AutoGiro") {
      let result = await updateAutoGiroAgreement(
        endpoint,
        distributionChanged ? distribution : null,
        dayChanged ? day : null,
        sumChanged ? sum : null,
        token,
      );

      if (result !== null) {
        successToast(configuration.toasts_configuration.success_text);
        mutate(`/donors/${getUserId(user)}/recurring/autogiro/`);
        setLoadingChanges(false);
        setLastSavedDistribution(JSON.parse(JSON.stringify(distribution)));
      } else {
        failureToast(
          (result?.status === 400 && configuration.toasts_configuration.bad_input_failure_text) ||
            configuration.toasts_configuration.failure_text,
        );
        setLoadingChanges(false);
      }
    } else {
      failureToast("Unknown agreement type");
      setLoadingChanges(false);
    }
  };

  const cancel = async () => {
    if (!user) throw new Error("User is not logged in");

    setLightboxOpen(false);
    const token = await getAccessTokenSilently();
    if (type === "Vipps") {
      const cancelled = await cancelVippsAgreement(endpoint, token);
      if (cancelled) {
        successToast(configuration.toasts_configuration.success_text);
        mutate(`/donors/${getUserId(user)}/recurring/vipps/`);
      } else {
        failureToast(configuration.toasts_configuration.failure_text);
      }
    } else if (type === "AvtaleGiro") {
      const cancelled = await cancelAvtaleGiroAgreement(endpoint, token);
      if (cancelled) {
        successToast(configuration.toasts_configuration.success_text);
        mutate(`/donors/${getUserId(user)}/recurring/avtalegiro/`);
      } else {
        failureToast(configuration.toasts_configuration.failure_text);
      }
    } else if (type === "AutoGiro") {
      const cancelled = await cancelAutoGiroAgreement(endpoint, token);
      if (cancelled) {
        successToast(configuration.toasts_configuration.success_text);
        mutate(`/donors/${getUserId(user)}/recurring/autogiro/`);
      } else {
        failureToast(configuration.toasts_configuration.failure_text);
      }
    } else {
      failureToast("Unknown agreement type");
    }
  };

  if (causeAreasLoading) {
    return (
      <div className={style.errorWrapper}>
        <p>{configuration.loading_text}</p>
      </div>
    );
  } else if (causeAreasError) {
    return (
      <div className={style.errorWrapper}>
        <p>{configuration.error_text}</p>
      </div>
    );
  } else if (!systemCauseAreas) {
    return (
      <div className={style.errorWrapper}>
        <p>{configuration.error_text}</p>
      </div>
    );
  }

  if (!distribution.causeAreas || distribution.causeAreas.some((c) => !c.organizations)) {
    return (
      <div className={style.errorWrapper}>
        <p>{configuration.error_text}</p>
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
            dateSelectorConfig={configuration.date_selector_configuration}
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
            configuration={configuration.distribution_configuration}
            dateSelectorConfig={configuration.date_selector_configuration}
          ></AgreementMultipleCauseAreaDetails>
        )}

        <div className={style.actions}>
          <EffektButton
            variant={EffektButtonVariant.SECONDARY}
            onClick={() => setLightboxOpen(true)}
            cy="btn-cancel-agreement"
          >
            {configuration.cancel_button_text}
          </EffektButton>
          <EffektButton onClick={() => save()} disabled={loadingChanges} cy="btn-save-agreement">
            {!loadingChanges ? configuration.save_button_text : configuration.loading_text}
          </EffektButton>
        </div>

        <Lightbox
          open={lightboxOpen}
          onConfirm={() => cancel()}
          onCancel={() => setLightboxOpen(false)}
        >
          <div className={style.textWrapper}>
            <h5>{configuration.agreement_cancel_lightbox.title}</h5>
            <p>{configuration.agreement_cancel_lightbox.text}</p>
            {checkPaymentDate(new Date(), day) && type === "AvtaleGiro" ? (
              <p>{configuration.agreement_cancel_lightbox.withdrawal_warning_text}</p>
            ) : null}
          </div>
        </Lightbox>
      </div>
    );
  }
};

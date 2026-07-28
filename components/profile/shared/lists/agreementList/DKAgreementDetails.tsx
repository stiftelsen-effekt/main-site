import React, { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSWRConfig } from "swr";
import AnimateHeight from "react-animate-height";
import { AlertCircle, Check, Info } from "react-feather";
import { toast } from "react-toastify";

import {
  DKAgreement,
  Distribution,
  DistributionCauseArea,
  DKPaymentMethod,
  TaxUnit,
} from "../../../../../models";
import { useCauseAreas } from "../../../../../_queries";
import { DatePickerInput } from "../../../../shared/components/DatePicker/DatePickerInput";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../../shared/components/EffektButton/EffektButton";
import { Lightbox } from "../../../../shared/components/Lightbox/Lightbox";
import { Toggle } from "../../../../shared/components/Widget/components/shared/Toggle/Toggle";
import { CauseArea } from "../../../../shared/components/Widget/types/CauseArea";
import { DistributionController } from "../../DistributionCauseAreaInput/Distribution";
import { DKTaxUnitCreateModal } from "../../TaxUnitModal/DKTaxUnitCreateModal";
import { TaxUnitSelector } from "../../TaxUnitSelector/TaxUnitSelector";
import { AgreementDetailsConfiguration } from "./AgreementDetails";
import { DKAgreementMembershipLine } from "./DKAgreementMembershipLine";
import { distributionTargetsMembershipFee, getDKMembershipDisplay } from "./dkMembershipDisplay";
import { getUserId } from "../../../../../lib/user";
import { cancelDKAgreement, updateDKAgreement } from "./_queries";
import {
  getStandardOrganizationId,
  getStandardOrganizationIds,
  hydrateDistributionAmounts,
  isAllocationVisible,
  orderDistributionCauseAreas,
  prepareDistributionForSave,
  setCauseAreaStandardSplit,
  setStandardCauseAreaAmount,
} from "../../distributionAmounts";

import style from "./DKAgreementDetails.module.scss";

const DEFAULT_MEMBERSHIP_PREFIX = "Medlemskab:";

export const DKAgreementDetails: React.FC<{
  agreement: DKAgreement;
  agreementId: string;
  method: DKPaymentMethod;
  inputSum: number;
  inputDate: number;
  inputDistribution?: Distribution;
  taxUnits: TaxUnit[];
  configuration: AgreementDetailsConfiguration;
}> = ({
  agreement,
  agreementId,
  method,
  inputSum,
  inputDate,
  inputDistribution,
  taxUnits,
  configuration,
}) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { mutate } = useSWRConfig();

  const [distribution, setDistribution] = useState<Distribution | null>(() =>
    inputDistribution ? hydrateDistributionAmounts(inputDistribution, inputSum) : null,
  );
  const [lastSavedDistribution, setLastSavedDistribution] = useState<Distribution | null>(() =>
    inputDistribution ? hydrateDistributionAmounts(inputDistribution, inputSum) : null,
  );
  const [day, setDay] = useState(inputDate);
  const [sum, setSum] = useState(inputSum);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [addTaxUnitOpen, setAddTaxUnitOpen] = useState(false);

  const {
    data: systemCauseAreas,
    error: causeAreasError,
    loading: causeAreasLoading,
  } = useCauseAreas(getAccessTokenSilently);

  useEffect(() => {
    const hydrated = inputDistribution
      ? hydrateDistributionAmounts(inputDistribution, inputSum)
      : null;
    setDistribution(hydrated);
    setLastSavedDistribution(hydrated);
  }, [inputDistribution, inputSum]);

  useEffect(() => {
    setDay(inputDate);
  }, [inputDate]);

  useEffect(() => {
    setSum(inputSum);
  }, [inputSum]);

  useEffect(() => {
    if (!systemCauseAreas || !distribution) {
      return;
    }

    const nextDistribution = addMissingCauseAreas(distribution, systemCauseAreas);
    if (JSON.stringify(nextDistribution) !== JSON.stringify(distribution)) {
      setDistribution(nextDistribution);
    }
  }, [systemCauseAreas, distribution]);

  const currentTaxUnit = useMemo(
    () => taxUnits.find((unit) => unit.id === distribution?.taxUnitId) ?? null,
    [distribution?.taxUnitId, taxUnits],
  );

  const membershipLabel = useMemo(
    () => getDKMembershipDisplay({ agreement, distribution, taxUnits }),
    [agreement, distribution, taxUnits],
  );

  const isMembershipFee = useMemo(
    () => distributionTargetsMembershipFee(distribution),
    [distribution],
  );

  const membershipPrefix =
    configuration.membership_label_prefix?.trim() || DEFAULT_MEMBERSHIP_PREFIX;

  const canEditDate = method !== "Bank transfer";
  const canSave = !isMembershipFee;
  const cancelLightboxText =
    method === "Bank transfer"
      ? configuration.agreement_cancel_lightbox.text_manual ||
        configuration.agreement_cancel_lightbox.text
      : configuration.agreement_cancel_lightbox.text;

  const save = async () => {
    if (!canSave) {
      return;
    }
    if (!user) {
      throw new Error("User is not logged in");
    }

    const token = await getAccessTokenSilently();
    const distributionChanged =
      JSON.stringify(distribution) !== JSON.stringify(lastSavedDistribution);
    const agreementSum =
      systemCauseAreas &&
      distribution &&
      (systemCauseAreas.length > 1 || !distribution.causeAreas[0]?.standardSplit)
        ? distribution.causeAreas.reduce((total, causeArea) => total + (causeArea.amount ?? 0), 0)
        : sum;
    const sumChanged = agreementSum !== inputSum;
    const dayChanged = canEditDate && day !== inputDate;

    if (!distributionChanged && !sumChanged && !dayChanged) {
      noChangesToast(configuration.toasts_configuration.no_changes_text);
      return;
    }

    let distributionPayload: Distribution | null = null;
    if (distribution) {
      try {
        distributionPayload = prepareDistributionForSave(
          distribution,
          agreementSum,
          getStandardOrganizationIds(systemCauseAreas ?? []),
        );
      } catch {
        failureToast(configuration.toasts_configuration.failure_text);
        return;
      }
    }

    setLoadingChanges(true);

    const result = await updateDKAgreement(
      getUserId(user),
      agreementId,
      distributionChanged || sumChanged ? distributionPayload : null,
      dayChanged ? day : null,
      sumChanged ? agreementSum : null,
      token,
    );

    if (result !== null) {
      successToast(configuration.toasts_configuration.success_text);
      setLastSavedDistribution(cloneDistribution(distribution));
      await mutate(`/donors/${getUserId(user)}/recurring/`);
    } else {
      failureToast(configuration.toasts_configuration.failure_text);
    }

    setLoadingChanges(false);
  };

  const changeSum = (nextSum: number) => {
    setDistribution((current) => {
      if (!current) return current;
      const causeArea = current.causeAreas[0];
      const systemCauseArea = systemCauseAreas?.find((system) => system.id === causeArea.id);
      const standardOrganizationId = systemCauseArea
        ? getStandardOrganizationId(systemCauseArea)
        : undefined;
      if (standardOrganizationId === undefined) return current;
      return {
        ...current,
        causeAreas: [setStandardCauseAreaAmount(causeArea, nextSum, standardOrganizationId)],
      };
    });
    setSum(nextSum);
  };

  const cancel = async () => {
    if (!user) {
      throw new Error("User is not logged in");
    }

    setLightboxOpen(false);
    const token = await getAccessTokenSilently();
    const cancelled = await cancelDKAgreement(getUserId(user), agreementId, token);

    if (cancelled) {
      successToast(configuration.toasts_configuration.success_text);
      await mutate(`/donors/${getUserId(user)}/recurring/`);
      return;
    }

    failureToast(configuration.toasts_configuration.failure_text);
  };

  if (isMembershipFee) {
    return (
      <div className={style.wrapper} data-cy="agreement-list-details">
        {membershipLabel ? (
          <DKAgreementMembershipLine prefix={membershipPrefix} label={membershipLabel} />
        ) : null}
        <div className={style.actions}>
          <EffektButton
            variant={EffektButtonVariant.SECONDARY}
            onClick={() => setLightboxOpen(true)}
            cy="btn-cancel-agreement"
          >
            {configuration.cancel_button_text}
          </EffektButton>
          {agreement.is_payment_expired ? (
            <EffektButton
              variant={EffektButtonVariant.SECONDARY}
              onClick={() => {
                window.location.href = `https://giveffektivt.dk/forny-betaling?id=${encodeURIComponent(
                  agreement.id,
                )}`;
              }}
              cy="btn-renew-payment"
            >
              Opdatér betaling
            </EffektButton>
          ) : null}
        </div>

        <Lightbox
          open={lightboxOpen}
          onConfirm={() => cancel()}
          onCancel={() => setLightboxOpen(false)}
        >
          <div className={style.textWrapper}>
            <h5>{configuration.agreement_cancel_lightbox.title}</h5>
            <p>{cancelLightboxText}</p>
          </div>
        </Lightbox>
      </div>
    );
  }

  if (causeAreasLoading) {
    return (
      <div className={style.errorWrapper}>
        <p>{configuration.loading_text}</p>
      </div>
    );
  }

  if (
    causeAreasError ||
    !systemCauseAreas ||
    !distribution ||
    !hasDistributionStructure(distribution)
  ) {
    return (
      <div className={style.errorWrapper}>
        <p>{configuration.error_text}</p>
      </div>
    );
  }

  const isSingleCauseArea = systemCauseAreas.length === 1;
  const singleCauseArea = distribution.causeAreas[0];
  const distributionAmount = distribution.causeAreas.reduce(
    (total, causeArea) => total + (causeArea.amount ?? 0),
    0,
  );
  const visibleCauseAreas = orderDistributionCauseAreas(
    distribution.causeAreas,
    systemCauseAreas,
  ).filter((causeArea) => {
    const systemCauseArea = systemCauseAreas.find((current) => current.id === causeArea.id);
    const savedAmount =
      lastSavedDistribution?.causeAreas.find((saved) => saved.id === causeArea.id)?.amount ?? 0;
    return isAllocationVisible(systemCauseArea ? systemCauseArea.isActive : false, savedAmount);
  });

  return (
    <div className={style.wrapper} data-cy="agreement-list-details">
      {membershipLabel ? (
        <DKAgreementMembershipLine prefix={membershipPrefix} label={membershipLabel} />
      ) : null}
      {isSingleCauseArea ? (
        <>
          <div className={style.values}>
            {canEditDate && (
              <div className={style.valuesDatePickerContainer}>
                <DatePickerInput
                  selected={day}
                  onChange={(selected) => setDay(selected)}
                  configuration={configuration.date_selector_configuration}
                />
              </div>
            )}

            <div className={style.valuesAmountContainer}>
              {singleCauseArea.standardSplit ? (
                <>
                  <input
                    className={style.amountInput}
                    type="text"
                    value={formatSum(sum.toString())}
                    onChange={(e) => changeSum(parseSum(e.currentTarget.value))}
                    data-cy="agreement-list-amount-input"
                  />
                  <span>kr</span>
                </>
              ) : (
                <>
                  <output className={style.calculatedAmount} data-cy="agreement-list-amount-input">
                    {formatSum((singleCauseArea.amount ?? 0).toString())}
                  </output>
                  <span>kr</span>
                </>
              )}
            </div>

            <div className={style.valuesTaxUnitSelectorContainer}>
              <TaxUnitSelector
                selected={currentTaxUnit?.archived === null ? currentTaxUnit : null}
                onChange={(unit) => setDistribution({ ...distribution, taxUnitId: unit.id })}
                onAddNew={() => setAddTaxUnitOpen(true)}
                placeholder="Anonym"
                addNewLabel="Tilføj ny enhed"
                loadingLabel="Indlæser..."
                errorLabel="Noget gik galt"
              />
            </div>

            <div className={style.valuesSmartDistributionToggle}>
              <span className="caption">
                {configuration.distribution_configuration?.smart_distribution_label ||
                  "Smart fordeling"}
              </span>
              <Toggle
                active={singleCauseArea.standardSplit}
                onChange={(active) => {
                  const nextCauseArea = setCauseAreaStandardSplit(singleCauseArea, active);
                  setDistribution({ ...distribution, causeAreas: [nextCauseArea] });
                  setSum(nextCauseArea.amount ?? 0);
                }}
              />
            </div>
          </div>

          <AnimateHeight height={!singleCauseArea.standardSplit ? "auto" : 0} animateOpacity={true}>
            <div className={style.singleCauseAreaDistribution}>
              <DistributionController
                causeArea={singleCauseArea}
                savedCauseArea={lastSavedDistribution?.causeAreas.find(
                  (saved) => saved.id === singleCauseArea.id,
                )}
                onChange={(causeArea) =>
                  setDistribution({
                    ...distribution,
                    causeAreas: [causeArea],
                  })
                }
              />
            </div>
          </AnimateHeight>
        </>
      ) : (
        <div className={style.multiLayout}>
          <div className={style.values}>
            {canEditDate && (
              <div className={style.valuesDatePickerContainer}>
                <DatePickerInput
                  selected={day}
                  onChange={(selected) => setDay(selected)}
                  configuration={configuration.date_selector_configuration}
                />
              </div>
            )}

            <div className={style.valuesAmountContainer}>
              <output className={style.calculatedAmount} data-cy="agreement-list-amount-input">
                {formatSum(distributionAmount.toString())}
              </output>
              <span>kr</span>
            </div>

            <div className={style.valuesTaxUnitSelectorContainer}>
              <TaxUnitSelector
                selected={currentTaxUnit?.archived === null ? currentTaxUnit : null}
                onChange={(unit) => setDistribution({ ...distribution, taxUnitId: unit.id })}
                onAddNew={() => setAddTaxUnitOpen(true)}
                placeholder="Anonym"
                addNewLabel="Tilføj ny enhed"
                loadingLabel="Indlæser..."
                errorLabel="Noget gik galt"
              />
            </div>
          </div>

          <div className={style.causeAreas}>
            {visibleCauseAreas.map((causeArea) => {
              const systemCauseArea = systemCauseAreas.find((item) => item.id === causeArea.id);
              const causeAreaHasMultipleOrganizations =
                (systemCauseArea?.organizations.length || 0) > 1;
              const standardOrganizationId = systemCauseArea
                ? getStandardOrganizationId(systemCauseArea)
                : undefined;

              return (
                <div key={`dist-${causeArea.id}`}>
                  <div className={style.distributionCauseAreaInputHeader}>
                    <span>{causeArea.name}</span>
                    <div className={style.valuesSmartDistributionToggle}>
                      {causeAreaHasMultipleOrganizations && (
                        <>
                          <span className="caption">
                            {configuration.distribution_configuration?.smart_distribution_label ||
                              "Smart fordeling"}
                          </span>
                          <Toggle
                            active={causeArea.standardSplit}
                            onChange={(active) =>
                              setDistribution({
                                ...distribution,
                                causeAreas: distribution.causeAreas.map((current) =>
                                  current.id === causeArea.id
                                    ? setCauseAreaStandardSplit(current, active)
                                    : { ...current },
                                ),
                              })
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className={style.distributionCauseAreaInputPercentageShare}>
                    {causeArea.standardSplit ? (
                      <>
                        <input
                          className={style.percentageInput}
                          type="text"
                          value={causeArea.amount ?? 0}
                          onChange={(e) => {
                            const amount = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setDistribution({
                              ...distribution,
                              causeAreas: distribution.causeAreas.map((current) =>
                                current.id === causeArea.id && standardOrganizationId !== undefined
                                  ? setStandardCauseAreaAmount(
                                      current,
                                      amount,
                                      standardOrganizationId,
                                    )
                                  : { ...current },
                              ),
                            });
                          }}
                          data-cy="cause-area-input"
                        />
                        <span>kr</span>
                      </>
                    ) : (
                      <>
                        <output className={style.calculatedAmount} data-cy="cause-area-input">
                          {formatSum((causeArea.amount ?? 0).toString())}
                        </output>
                        <span>kr</span>
                      </>
                    )}
                  </div>

                  <AnimateHeight
                    height={causeArea.standardSplit ? 0 : "auto"}
                    animateOpacity={true}
                  >
                    <div className={style.distributionCauseAreaInputContainer}>
                      <DistributionController
                        causeArea={causeArea}
                        savedCauseArea={lastSavedDistribution?.causeAreas.find(
                          (saved) => saved.id === causeArea.id,
                        )}
                        onChange={(nextCauseArea) =>
                          setDistribution({
                            ...distribution,
                            causeAreas: distribution.causeAreas.map((current) =>
                              current.id === nextCauseArea.id ? nextCauseArea : { ...current },
                            ),
                          })
                        }
                      />
                    </div>
                  </AnimateHeight>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={style.actions}>
        <EffektButton
          variant={EffektButtonVariant.SECONDARY}
          onClick={() => setLightboxOpen(true)}
          cy="btn-cancel-agreement"
        >
          {configuration.cancel_button_text}
        </EffektButton>
        {agreement.is_payment_expired ? (
          <EffektButton
            variant={EffektButtonVariant.SECONDARY}
            onClick={() => {
              window.location.href = `https://giveffektivt.dk/forny-betaling?id=${encodeURIComponent(
                agreement.id,
              )}`;
            }}
            cy="btn-renew-payment"
          >
            Opdatér betaling
          </EffektButton>
        ) : null}
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
          <p>{cancelLightboxText}</p>
        </div>
      </Lightbox>

      {addTaxUnitOpen && (
        <DKTaxUnitCreateModal
          open={addTaxUnitOpen}
          onFailure={() => {}}
          onSuccess={(unit: TaxUnit) => {
            setDistribution((current) => (current ? { ...current, taxUnitId: unit.id } : current));
            setAddTaxUnitOpen(false);
          }}
          onClose={() => setAddTaxUnitOpen(false)}
        />
      )}
    </div>
  );
};

const cloneDistribution = (distribution?: Distribution | null) =>
  distribution ? JSON.parse(JSON.stringify(distribution)) : null;

const addMissingCauseAreas = (distribution: Distribution, systemCauseAreas: CauseArea[]) => {
  const nextDistribution = cloneDistribution(distribution) as Distribution;
  const distributionCauseAreaIds = nextDistribution.causeAreas.map((causeArea) => causeArea.id);
  const missingCauseAreas = systemCauseAreas.filter(
    (causeArea) => !distributionCauseAreaIds.includes(causeArea.id),
  );

  missingCauseAreas.forEach((causeArea) => {
    nextDistribution.causeAreas.push({
      id: causeArea.id,
      name: causeArea.name,
      standardSplit: true,
      percentageShare: "0",
      amount: 0,
      organizations: causeArea.organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
        percentageShare: organization.standardShare?.toString() || "0",
        amount: 0,
      })),
    });
  });

  return nextDistribution;
};

const hasDistributionStructure = (distribution: Distribution) =>
  Array.isArray(distribution.causeAreas) &&
  distribution.causeAreas.length > 0 &&
  distribution.causeAreas.every((causeArea: DistributionCauseArea) =>
    Array.isArray(causeArea.organizations),
  );

const formatSum = (sum: string) => {
  const parts = sum.split(".");
  const formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.length === 2 ? formatted + "." + parts[1] : formatted;
};

const parseSum = (sum: string) => parseInt(sum.replace(/ /g, ""), 10) || 0;

const successToast = (text: string) =>
  toast.success(text, { icon: <Check size={24} color={"black"} /> });

const failureToast = (text: string) =>
  toast.error(text, { icon: <AlertCircle size={24} color={"black"} /> });

const noChangesToast = (text: string) =>
  toast.error(text, { icon: <Info size={24} color={"black"} /> });

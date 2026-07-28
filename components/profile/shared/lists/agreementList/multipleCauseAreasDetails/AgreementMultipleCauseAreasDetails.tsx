import { TaxUnitSelector } from "../../../TaxUnitSelector/TaxUnitSelector";
import { TaxUnitCreateModal } from "../../../TaxUnitModal/TaxUnitCreateModal";
import AnimateHeight from "react-animate-height";
import { Toggle } from "../../../../../shared/components/Widget/components/shared/Toggle/Toggle";
import {
  DatePickerInput,
  DatePickerInputConfiguration,
} from "../../../../../shared/components/DatePicker/DatePickerInput";
import { Distribution, TaxUnit } from "../../../../../../models";
import { DistributionController } from "../../../DistributionCauseAreaInput/Distribution";
import { useState } from "react";

import style from "./AgreementMultipleCauseAreaDetails.module.scss";
import { CauseArea } from "../../../../../shared/components/Widget/types/CauseArea";
import {
  getStandardOrganizationId,
  isAllocationVisible,
  orderDistributionCauseAreas,
  setCauseAreaStandardSplit,
  setStandardCauseAreaAmount,
} from "../../../distributionAmounts";

export type AgreementMultipleCauseAreaDetailsConfiguration = {
  smart_distribution_label: string;
};

export const AgreementMultipleCauseAreaDetails: React.FC<{
  systemCauseAreas: CauseArea[];
  distribution: Distribution;
  savedDistribution: Distribution;
  setDistribution: (dist: Distribution) => void;
  day: number;
  setDay: (day: number) => void;
  taxUnits: TaxUnit[];
  configuration: AgreementMultipleCauseAreaDetailsConfiguration;
  dateSelectorConfig: DatePickerInputConfiguration;
}> = ({
  systemCauseAreas,
  distribution,
  savedDistribution,
  setDistribution,
  day,
  setDay,
  taxUnits,
  configuration,
  dateSelectorConfig,
}) => {
  const [addTaxUnitOpen, setAddTaxUnitOpen] = useState(false);

  const currentTaxUnit = taxUnits.find((unit) => unit.id === distribution.taxUnitId);
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
      savedDistribution.causeAreas.find((saved) => saved.id === causeArea.id)?.amount ?? 0;
    return isAllocationVisible(systemCauseArea ? systemCauseArea.isActive : false, savedAmount);
  });

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.values}>
          <div className={style.valuesDatePickerContainer}>
            <DatePickerInput
              selected={day}
              onChange={(date) => setDay(date)}
              configuration={dateSelectorConfig}
            />
          </div>
          <div className={style.valuesAmountContainer}>
            <output className={style.calculatedAmount} data-cy="agreement-list-amount-input">
              {formatSum(distributionAmount.toString())} kr
            </output>
          </div>
          <div className={style.valuesTaxUnitSelectorContainer}>
            <TaxUnitSelector
              selected={currentTaxUnit?.archived === null ? currentTaxUnit : null}
              onChange={(unit) => setDistribution({ ...distribution, taxUnitId: unit.id })}
              onAddNew={() => setAddTaxUnitOpen(true)}
            />
          </div>
        </div>
        <div className={style.causeAreas}>
          {visibleCauseAreas.map((causeArea, index) => {
            const systemCauseArea = systemCauseAreas.find((current) => current.id === causeArea.id);
            const causeAreaHasMultipleOrganizations =
              (systemCauseArea?.organizations.length || 0) > 1;
            const standardOrganizationId = systemCauseArea
              ? getStandardOrganizationId(systemCauseArea)
              : undefined;
            return (
              <div key={`dist-${causeArea.id}`}>
                <div className={style.distributionCauseAreaInputHeader}>
                  <span>{causeArea.name}</span>
                  {causeAreaHasMultipleOrganizations && (
                    <div className={style.valuesSmartDistributionToggle}>
                      <span>{configuration.smart_distribution_label}</span>
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
                    </div>
                  )}
                </div>
                <div className={style.distributionCauseAreaInputPercentageShare}>
                  {causeArea.standardSplit ? (
                    <>
                      <input
                        type="text"
                        value={causeArea.amount ?? 0}
                        onChange={(e) => {
                          const amount = Math.max(0, parseInt(e.target.value, 10) || 0);
                          const causeAreas = [...distribution.causeAreas];
                          const index = causeAreas.findIndex(
                            (current) => current.id === causeArea.id,
                          );
                          if (index === -1 || standardOrganizationId === undefined) return;
                          causeAreas[index] = setStandardCauseAreaAmount(
                            causeAreas[index],
                            amount,
                            standardOrganizationId,
                          );
                          setDistribution({ ...distribution, causeAreas });
                        }}
                        data-cy="cause-area-input"
                      />
                      <span>kr</span>
                    </>
                  ) : (
                    <output className={style.calculatedAmount} data-cy="cause-area-input">
                      {formatSum((causeArea.amount ?? 0).toString())} kr
                    </output>
                  )}
                </div>
                <AnimateHeight
                  key={index}
                  height={causeArea.standardSplit ? 0 : "auto"}
                  animateOpacity={true}
                >
                  <div className={style.distributionCauseAreaInputContainer}>
                    <DistributionController
                      causeArea={causeArea}
                      savedCauseArea={savedDistribution.causeAreas.find(
                        (saved) => saved.id === causeArea.id,
                      )}
                      onChange={(causeArea) => {
                        const causeAreas = [...distribution.causeAreas];
                        const index = causeAreas.findIndex((c) => c.id === causeArea.id);
                        if (index === -1) {
                          causeAreas.push(causeArea);
                        } else {
                          causeAreas[index] = causeArea;
                        }
                        setDistribution({ ...distribution, causeAreas });
                      }}
                    ></DistributionController>
                  </div>
                </AnimateHeight>
              </div>
            );
          })}
        </div>
      </div>
      {addTaxUnitOpen && (
        <TaxUnitCreateModal
          open={addTaxUnitOpen}
          onFailure={() => {}}
          onSuccess={(unit: TaxUnit) => {
            setDistribution({ ...distribution, taxUnitId: unit.id });
            setAddTaxUnitOpen(false);
          }}
          onClose={() => setAddTaxUnitOpen(false)}
        />
      )}
    </>
  );
};

/**
 * Take input sum and add a thin seperator between every 3rd digit.
 */
const formatSum = (sum: string) => {
  const parts = sum.split(".");
  const formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.length === 2 ? formatted + "." + parts[1] : formatted;
};

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

export type AgreementMultipleCauseAreaDetailsConfiguration = {
  smart_distribution_label: string;
};

export const AgreementMultipleCauseAreaDetails: React.FC<{
  systemCauseAreas: CauseArea[];
  distribution: Distribution;
  setDistribution: (dist: Distribution) => void;
  day: number;
  setDay: (day: number) => void;
  sum: number;
  setSum: (sum: number) => void;
  taxUnits: TaxUnit[];
  configuration: AgreementMultipleCauseAreaDetailsConfiguration;
  dateSelectorConfig: DatePickerInputConfiguration;
}> = ({
  systemCauseAreas,
  distribution,
  setDistribution,
  day,
  setDay,
  sum,
  setSum,
  taxUnits,
  configuration,
  dateSelectorConfig,
}) => {
  const [addTaxUnitOpen, setAddTaxUnitOpen] = useState(false);

  const currentTaxUnit = taxUnits.find((unit) => unit.id === distribution.taxUnitId);

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
            <input
              type="text"
              value={formatSum(sum.toString())}
              onChange={(e) => setSum(parseSum(e.currentTarget.value))}
              data-cy="agreement-list-amount-input"
            />
            <span>kr</span>
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
          {distribution.causeAreas.map((causeArea, index) => {
            const causeAreaHasMultipleOrganizations =
              (systemCauseAreas.find((c) => c.id === causeArea.id)?.organizations.length || 0) > 1;
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
                            causeAreas: distribution.causeAreas.map((c) => {
                              if (causeArea && c.id === causeArea.id) {
                                return { ...c, standardSplit: active };
                              } else {
                                return { ...c };
                              }
                            }),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                <div className={style.distributionCauseAreaInputPercentageShare}>
                  <input
                    type="text"
                    value={Math.round(parseFloat(causeArea.percentageShare)).toString() || 0}
                    onChange={(e) => {
                      const percentageShare = parseFloat(e.target.value) || 0;
                      const causeAreas = [...distribution.causeAreas];
                      const index = causeAreas.findIndex((c) => c.id === causeArea?.id);
                      if (index === -1) {
                        return;
                      } else {
                        causeAreas[index] = {
                          ...causeAreas[index],
                          percentageShare: percentageShare.toFixed(0),
                        };
                      }
                      setDistribution({ ...distribution, causeAreas });
                    }}
                    data-cy="distribution-input"
                  />
                  <span>%</span>
                </div>
                <AnimateHeight
                  key={index}
                  height={causeArea.standardSplit ? 0 : "auto"}
                  animateOpacity={true}
                >
                  <div className={style.distributionCauseAreaInputContainer}>
                    <DistributionController
                      causeArea={causeArea}
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

/**
 * Strip thin seperator from sum and return a number.
 */
const parseSum = (sum: string) => {
  return parseFloat(sum.replace(/ /g, "")) || 0;
};

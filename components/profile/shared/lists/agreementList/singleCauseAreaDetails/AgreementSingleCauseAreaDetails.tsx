import { TaxUnitSelector } from "../../../TaxUnitSelector/TaxUnitSelector";
import { TaxUnitCreateModal } from "../../../TaxUnitModal/TaxUnitCreateModal";
import AnimateHeight from "react-animate-height";
import { Toggle } from "../../../../../shared/components/Widget/components/shared/Toggle/Toggle";
import {
  DatePickerInput,
  DatePickerInputConfiguration,
} from "../../../../../shared/components/DatePicker/DatePickerInput";

import style from "./AgreementSingleCauseAreaDetails.module.scss";
import { Distribution, TaxUnit } from "../../../../../../models";
import { DistributionController } from "../../../DistributionCauseAreaInput/Distribution";
import { useState } from "react";
import { setCauseAreaStandardSplit } from "../../../distributionAmounts";

export const AgreementSingleCauseAreaDetails: React.FC<{
  distribution: Distribution;
  savedDistribution: Distribution;
  setDistribution: (dist: Distribution) => void;
  day: number;
  setDay: (day: number) => void;
  sum: number;
  setSum: (sum: number) => void;
  taxUnits: TaxUnit[];
  dateSelectorConfig: DatePickerInputConfiguration;
}> = ({
  distribution,
  savedDistribution,
  setDistribution,
  day,
  setDay,
  sum,
  setSum,
  taxUnits,
  dateSelectorConfig,
}) => {
  const [addTaxUnitOpen, setAddTaxUnitOpen] = useState(false);

  const currentTaxUnit = taxUnits.find((unit) => unit.id === distribution.taxUnitId);
  const causeArea = distribution.causeAreas[0];

  return (
    <>
      <div className={style.values}>
        <div className={style.valuesDatePickerContainer}>
          <DatePickerInput
            selected={day}
            onChange={(date) => setDay(date)}
            configuration={dateSelectorConfig}
          />
        </div>
        <div className={style.valuesAmountContainer}>
          {causeArea.standardSplit ? (
            <>
              <input
                type="text"
                value={formatSum(sum.toString())}
                onChange={(e) => setSum(parseSum(e.currentTarget.value))}
                data-cy="agreement-list-amount-input"
              />
              <span>kr</span>
            </>
          ) : (
            <output className={style.calculatedAmount} data-cy="agreement-list-amount-input">
              {formatSum((causeArea.amount ?? 0).toString())} kr
            </output>
          )}
        </div>
        <div className={style.valuesTaxUnitSelectorContainer}>
          <TaxUnitSelector
            selected={currentTaxUnit?.archived === null ? currentTaxUnit : null}
            onChange={(unit) => setDistribution({ ...distribution, taxUnitId: unit.id })}
            onAddNew={() => setAddTaxUnitOpen(true)}
          />
        </div>
        <div className={style.valuesSmartDistributionToggle}>
          <span>Smart fordeling</span>
          <Toggle
            active={causeArea.standardSplit}
            onChange={(active) => {
              const nextCauseArea = setCauseAreaStandardSplit(causeArea, active);
              setDistribution({ ...distribution, causeAreas: [nextCauseArea] });
              setSum(nextCauseArea.amount ?? 0);
            }}
          />
        </div>
      </div>

      {distribution.causeAreas.map((causeArea, index) => (
        <AnimateHeight
          key={index}
          height={causeArea.standardSplit ? 0 : "auto"}
          animateOpacity={true}
        >
          <DistributionController
            causeArea={causeArea}
            savedCauseArea={savedDistribution.causeAreas.find((saved) => saved.id === causeArea.id)}
            onChange={(causeArea) => {
              const causeAreas = [...distribution.causeAreas];
              causeAreas[index] = causeArea;
              setDistribution({ ...distribution, causeAreas });
            }}
          ></DistributionController>
        </AnimateHeight>
      ))}

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
  return parseInt(sum.replace(/ /g, ""), 10) || 0;
};

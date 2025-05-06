import { useMemo } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { ShareType } from "../../../types/Enums";
import { CauseArea } from "../../../types/CauseArea";

const OPERATIONS_CAUSE_AREA_ID = 4;

export const useAmountCalculation = (
  selectionType: string,
  selectedCauseAreaId: number | null,
  causeAreas: CauseArea[],
) => {
  const {
    causeAreaAmounts = {},
    orgAmounts = {},
    causeAreaDistributionType = {},
  } = useSelector((state: State) => state.donation);

  // Calculate the sum of all donations EXCLUDING the operations tip
  const sumOfOtherCauseAreas = useMemo(() => {
    return Object.keys(causeAreaAmounts).reduce((acc, key) => {
      const causeAreaId = parseInt(key);

      if (causeAreaId === OPERATIONS_CAUSE_AREA_ID) {
        return acc;
      }

      if (selectionType === "single" && selectedCauseAreaId !== causeAreaId) {
        return acc;
      }

      let amountForThisCauseArea = 0;
      if (causeAreaDistributionType[causeAreaId] === ShareType.CUSTOM) {
        const currentCauseArea = causeAreas.find((ca) => ca.id === causeAreaId);
        if (currentCauseArea) {
          amountForThisCauseArea = currentCauseArea.organizations.reduce((orgSum, org) => {
            return orgSum + (Number(orgAmounts[org.id]) || 0);
          }, 0);
        }
      } else {
        amountForThisCauseArea = Number(causeAreaAmounts[causeAreaId]) || 0;
      }

      return acc + amountForThisCauseArea;
    }, 0);
  }, [
    causeAreaAmounts,
    causeAreaDistributionType,
    orgAmounts,
    causeAreas,
    selectionType,
    selectedCauseAreaId,
  ]);

  // Calculate total amount including tip
  const totalAmount = useMemo(() => {
    let currentTotal = 0;
    if (selectedCauseAreaId === -1) {
      currentTotal = causeAreas.reduce((acc, area) => {
        if (
          causeAreaDistributionType[area.id] === ShareType.CUSTOM &&
          area.id !== OPERATIONS_CAUSE_AREA_ID
        ) {
          return (
            acc + area.organizations.reduce((orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0), 0)
          );
        }
        return acc + (causeAreaAmounts[area.id] || 0);
      }, 0);
    } else if (selectionType === "multiple") {
      currentTotal = causeAreas
        .filter((ca) => ca.id !== 5)
        .reduce((acc, area) => {
          if (
            causeAreaDistributionType[area.id] === ShareType.CUSTOM &&
            area.id !== OPERATIONS_CAUSE_AREA_ID
          ) {
            return (
              acc +
              area.organizations.reduce((orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0), 0)
            );
          }
          return acc + (causeAreaAmounts[area.id] || 0);
        }, 0);
    } else if (selectionType === "single" && selectedCauseAreaId != null) {
      const selectedArea = causeAreas.find((area) => area.id === selectedCauseAreaId);
      if (selectedArea) {
        if (causeAreaDistributionType[selectedCauseAreaId] === ShareType.STANDARD) {
          currentTotal += causeAreaAmounts[selectedCauseAreaId] || 0;
        } else {
          currentTotal += selectedArea.organizations.reduce(
            (orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0),
            0,
          );
        }
      }
      if (selectedCauseAreaId !== OPERATIONS_CAUSE_AREA_ID) {
        currentTotal += causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0;
      }
    }
    return currentTotal;
  }, [
    causeAreaAmounts,
    orgAmounts,
    selectionType,
    selectedCauseAreaId,
    causeAreas,
    causeAreaDistributionType,
  ]);

  return {
    sumOfOtherCauseAreas,
    totalAmount,
    causeAreaAmounts,
    orgAmounts,
    causeAreaDistributionType,
  };
};

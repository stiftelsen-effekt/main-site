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
    operationsPercentageByCauseArea = {},
    globalOperationsEnabled = false,
  } = useSelector((state: State) => state.donation);

  // Calculate the sum of all donations EXCLUDING the operations cut
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

  // Calculate total amount
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
      // For multiple cause areas, sum up all amounts
      currentTotal = causeAreas
        .filter((ca) => ca.id !== 5 && ca.id !== OPERATIONS_CAUSE_AREA_ID)
        .reduce((acc, area) => {
          if (causeAreaDistributionType[area.id] === ShareType.CUSTOM) {
            return (
              acc +
              area.organizations.reduce((orgAcc, org) => orgAcc + (orgAmounts[org.id] || 0), 0)
            );
          }
          // Add the cause area amount (which is what the user sees in the input)
          return acc + (causeAreaAmounts[area.id] || 0);
        }, 0);

      // For multiple cause areas, the total is just the sum of amounts entered
      // Operations cut is calculated FROM this total, not added to it
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
      // For single cause area, the total is what the user entered
      // Operations cut is calculated FROM this total, not added to it
    }
    return currentTotal;
  }, [
    causeAreaAmounts,
    orgAmounts,
    operationsPercentageByCauseArea,
    selectionType,
    selectedCauseAreaId,
    causeAreas,
    causeAreaDistributionType,
    globalOperationsEnabled,
  ]);

  return {
    sumOfOtherCauseAreas,
    totalAmount,
    causeAreaAmounts,
    orgAmounts,
    causeAreaDistributionType,
  };
};

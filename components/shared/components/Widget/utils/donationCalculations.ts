import { CauseArea } from "../types/CauseArea";
import { ShareType } from "../types/Enums";

export interface DonationBreakdown {
  causeAreaAmounts: Record<number, number>;
  organizationAmounts: Record<number, number>;
  operationsAmount: number;
  totalAmount: number;
}

/**
 * Calculates the actual donation amounts after applying operations cuts
 * This is the single source of truth for how donations are distributed
 */
export function calculateDonationBreakdown(
  causeAreaAmounts: Record<number, number>,
  orgAmounts: Record<number, number>,
  causeAreaDistributionType: Record<number, ShareType>,
  operationsAmountsByCauseArea: Record<number, number>,
  causeAreas: CauseArea[],
  selectionType: "single" | "multiple",
  selectedCauseAreaId: number | null | undefined,
  globalOperationsEnabled: boolean,
  smartDistributionTotal?: number,
): DonationBreakdown {
  const result: DonationBreakdown = {
    causeAreaAmounts: {},
    organizationAmounts: {},
    operationsAmount: 0,
    totalAmount: 0,
  };

  // Handle smart distribution mode
  if (selectedCauseAreaId === -1 && smartDistributionTotal) {
    causeAreas.forEach((area) => {
      if (area.standardPercentageShare && area.standardPercentageShare > 0) {
        const areaAmount = Math.round(
          (area.standardPercentageShare / 100) * smartDistributionTotal,
        );
        result.causeAreaAmounts[area.id] = areaAmount;

        // Distribute among organizations
        area.organizations.forEach((org) => {
          if (org.standardShare && org.standardShare > 0) {
            const orgAmount = Math.round((org.standardShare / 100) * areaAmount);
            result.organizationAmounts[org.id] = orgAmount;
          }
        });
      }
    });
    result.totalAmount = smartDistributionTotal;
    return result;
  }

  // Calculate total operations amount based on selection type
  let totalOperationsAmount = 0;

  if (selectionType === "multiple" && globalOperationsEnabled) {
    // For multiple cause areas, calculate 5% of total
    let totalBeforeOperations = 0;

    causeAreas.forEach((area) => {
      if (area.id === 4 || area.id === 5) return;

      if (causeAreaDistributionType[area.id] === ShareType.CUSTOM) {
        const orgTotal = area.organizations.reduce(
          (sum, org) => sum + (orgAmounts[org.id] || 0),
          0,
        );
        totalBeforeOperations += orgTotal;
      } else {
        totalBeforeOperations += causeAreaAmounts[area.id] || 0;
      }
    });

    totalOperationsAmount = Math.round(totalBeforeOperations * 0.05);
  } else if (
    selectionType === "single" &&
    selectedCauseAreaId !== null &&
    selectedCauseAreaId !== undefined
  ) {
    // For single cause area, use the specific operations amount
    totalOperationsAmount = operationsAmountsByCauseArea[selectedCauseAreaId] || 0;
  }

  result.operationsAmount = totalOperationsAmount;

  // Process each cause area
  causeAreas.forEach((area) => {
    // Skip areas not relevant to current selection
    if (selectionType === "single" && area.id !== selectedCauseAreaId) {
      return;
    }
    if (selectionType === "multiple" && (area.id === 5 || area.id === 4)) {
      return;
    }

    const areaAmount = causeAreaAmounts[area.id] || 0;
    if (areaAmount === 0 && causeAreaDistributionType[area.id] !== ShareType.CUSTOM) {
      return;
    }

    if (causeAreaDistributionType[area.id] === ShareType.STANDARD) {
      let netAreaAmount = areaAmount;

      // Apply cuts
      if (selectionType === "single" && area.id === selectedCauseAreaId) {
        const operationsCut = operationsAmountsByCauseArea[area.id] || 0;
        netAreaAmount = areaAmount - operationsCut;
      } else if (
        selectionType === "multiple" &&
        globalOperationsEnabled &&
        totalOperationsAmount > 0
      ) {
        // Calculate proportional cut for this area
        const totalCauseAreaAmount = causeAreas
          .filter((ca) => ca.id !== 4 && ca.id !== 5 && (causeAreaAmounts[ca.id] || 0) > 0)
          .reduce((sum, ca) => sum + (causeAreaAmounts[ca.id] || 0), 0);

        if (totalCauseAreaAmount > 0) {
          const proportion = areaAmount / totalCauseAreaAmount;
          const areaCut = Math.round(totalOperationsAmount * proportion);
          netAreaAmount = areaAmount - areaCut;
        }
      }

      result.causeAreaAmounts[area.id] = netAreaAmount;

      // Distribute to organizations based on standard shares
      area.organizations.forEach((org) => {
        if (org.standardShare && org.standardShare > 0) {
          const orgAmount = Math.round((org.standardShare / 100) * netAreaAmount);
          result.organizationAmounts[org.id] =
            (result.organizationAmounts[org.id] || 0) + orgAmount;
        }
      });
    } else if (causeAreaDistributionType[area.id] === ShareType.CUSTOM) {
      // Calculate total for custom distribution
      const totalOrgAmount = area.organizations.reduce(
        (sum, org) => sum + (orgAmounts[org.id] || 0),
        0,
      );

      if (totalOrgAmount > 0) {
        let netTotalOrgAmount = totalOrgAmount;
        let reduction = 1;

        // Apply cuts
        if (selectionType === "single" && area.id === selectedCauseAreaId) {
          const operationsCut = operationsAmountsByCauseArea[area.id] || 0;
          netTotalOrgAmount = totalOrgAmount - operationsCut;
          if (operationsCut > 0 && totalOrgAmount > 0) {
            reduction = 1 - operationsCut / totalOrgAmount;
          }
        } else if (
          selectionType === "multiple" &&
          globalOperationsEnabled &&
          totalOperationsAmount > 0
        ) {
          // Calculate proportional cut
          const totalCauseAreaAmount = causeAreas
            .filter((ca) => ca.id !== 4 && ca.id !== 5)
            .reduce((sum, ca) => {
              if (causeAreaDistributionType[ca.id] === ShareType.CUSTOM) {
                return (
                  sum +
                  ca.organizations.reduce((orgSum, org) => orgSum + (orgAmounts[org.id] || 0), 0)
                );
              }
              return sum + (causeAreaAmounts[ca.id] || 0);
            }, 0);

          if (totalCauseAreaAmount > 0) {
            const proportion = totalOrgAmount / totalCauseAreaAmount;
            const areaCut = Math.round(totalOperationsAmount * proportion);
            netTotalOrgAmount = totalOrgAmount - areaCut;
            if (areaCut > 0 && totalOrgAmount > 0) {
              reduction = 1 - areaCut / totalOrgAmount;
            }
          }
        }

        result.causeAreaAmounts[area.id] = netTotalOrgAmount;

        // Apply reduction to each organization
        area.organizations.forEach((org) => {
          const orgAmount = orgAmounts[org.id] || 0;
          if (orgAmount > 0) {
            const netOrgAmount = Math.round(orgAmount * reduction);
            result.organizationAmounts[org.id] =
              (result.organizationAmounts[org.id] || 0) + netOrgAmount;
          }
        });
      }
    }
  });

  // Calculate total
  result.totalAmount =
    Object.values(result.causeAreaAmounts).reduce((sum, amount) => sum + amount, 0) +
    result.operationsAmount;

  return result;
}

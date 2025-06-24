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
  globalOperationsAmount?: number,
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
        const areaAmount = (area.standardPercentageShare / 100) * smartDistributionTotal;
        result.causeAreaAmounts[area.id] = areaAmount;

        // Distribute among organizations
        area.organizations.forEach((org) => {
          if (org.standardShare && org.standardShare > 0) {
            const orgAmount = (org.standardShare / 100) * areaAmount;
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

  if (selectionType === "multiple") {
    // For multiple cause areas, use the global operations amount
    totalOperationsAmount = globalOperationsAmount || 0;
  } else if (
    selectionType === "single" &&
    selectedCauseAreaId !== null &&
    selectedCauseAreaId !== undefined
  ) {
    // For single cause area, use the specific operations amount
    totalOperationsAmount = operationsAmountsByCauseArea[selectedCauseAreaId] || 0;
  }

  result.operationsAmount = totalOperationsAmount;

  const initialTotalCauseAreaAmounts = Object.values(causeAreaAmounts).reduce(
    (sum, amount) => sum + amount,
    0,
  );

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
      } else if (selectionType === "multiple" && totalOperationsAmount > 0) {
        // For multiple cause areas we need to spread the operations cut proportionally
        const share = areaAmount / initialTotalCauseAreaAmounts;
        const operationsCut = totalOperationsAmount * share;
        netAreaAmount = areaAmount - operationsCut;
      }

      result.causeAreaAmounts[area.id] = netAreaAmount;

      // Distribute to organizations based on standard shares
      area.organizations.forEach((org) => {
        if (org.standardShare && org.standardShare > 0) {
          const orgAmount = (org.standardShare / 100) * netAreaAmount;
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
        } else if (selectionType === "multiple" && totalOperationsAmount > 0) {
          // For multiple cause areas we need to spread the operations cut proportionally
          const share = totalOrgAmount / initialTotalCauseAreaAmounts;
          const operationsCut = totalOperationsAmount * share;
          netTotalOrgAmount = totalOrgAmount - operationsCut;
          if (operationsCut > 0 && totalOrgAmount > 0) {
            reduction = 1 - operationsCut / totalOrgAmount;
          }
        }

        result.causeAreaAmounts[area.id] = netTotalOrgAmount;

        // Apply reduction to each organization
        area.organizations.forEach((org) => {
          const orgAmount = orgAmounts[org.id] || 0;
          if (orgAmount > 0) {
            const netOrgAmount = orgAmount * reduction;
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

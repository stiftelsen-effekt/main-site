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
  operationsPercentageModeByCauseArea: Record<number, boolean>,
  operationsPercentageByCauseArea: Record<number, number>,
  causeAreas: CauseArea[],
  selectionType: "single" | "multiple",
  selectedCauseAreaId: number | null | undefined,
  globalOperationsEnabled: boolean,
  globalOperationsPercentage: number,
  ignoredCauseAreas: number[], // Ignored cause areas for multiple selection
  // Undefined on platforms that have no dedicated operations cause area (e.g. where
  // operations is an organization inside a regular cause area instead)
  operationsCauseAreaId: number | undefined,
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
    const operationsAmount = globalOperationsEnabled
      ? Math.round((smartDistributionTotal * globalOperationsPercentage) / 100)
      : 0;
    const distributedAmount = smartDistributionTotal - operationsAmount;

    causeAreas.forEach((area) => {
      if (area.standardPercentageShare && area.standardPercentageShare > 0) {
        const areaAmount = (area.standardPercentageShare / 100) * distributedAmount;
        result.causeAreaAmounts[area.id] = areaAmount;

        area.organizations.forEach((org) => {
          if (org.standardShare && org.standardShare > 0) {
            const orgAmount = (org.standardShare / 100) * areaAmount;
            result.organizationAmounts[org.id] = orgAmount;
          }
        });
      }
    });
    result.operationsAmount = operationsAmount;
    result.totalAmount = smartDistributionTotal;
    return result;
  }

  // Calculate total operations amount based on selection type
  let totalOperationsAmount = 0;

  let multipleTotalDonation = 0;
  if (selectionType === "multiple" && globalOperationsEnabled) {
    const customDistributionAreasIds = causeAreas
      .filter((area) => causeAreaDistributionType[area.id] === ShareType.CUSTOM)
      .map((area) => area.id);
    // For multiple cause areas, calculate based on global percentage
    multipleTotalDonation =
      (smartDistributionTotal || 0) +
      Object.entries(causeAreaAmounts).reduce(
        (sum, entry) =>
          sum +
          (ignoredCauseAreas.includes(parseInt(entry[0])) ||
          customDistributionAreasIds.includes(parseInt(entry[0]))
            ? 0
            : entry[1]),
        0,
      );
    // Add organization amounts for custom distribution
    for (const customCauseAreaId of customDistributionAreasIds) {
      const orgs = causeAreas.find((area) => area.id === customCauseAreaId)?.organizations || [];

      orgs.forEach((org) => {
        multipleTotalDonation += orgAmounts[org.id] || 0;
      });
    }

    totalOperationsAmount = Math.round((multipleTotalDonation * globalOperationsPercentage) / 100);
  } else if (
    selectionType === "single" &&
    selectedCauseAreaId !== null &&
    selectedCauseAreaId !== undefined &&
    operationsPercentageModeByCauseArea[selectedCauseAreaId]
  ) {
    // For single cause area, calculate based on specific percentage
    let causeAreaAmount = 0;
    if (causeAreaDistributionType[selectedCauseAreaId] === ShareType.STANDARD) {
      causeAreaAmount = causeAreaAmounts[selectedCauseAreaId] || 0;
    } else if (causeAreaDistributionType[selectedCauseAreaId] === ShareType.CUSTOM) {
      const orgs = causeAreas.find((area) => area.id === selectedCauseAreaId)?.organizations || [];
      causeAreaAmount = orgs.reduce((sum, org) => sum + (orgAmounts[org.id] || 0), 0);
    }
    const percentage = operationsPercentageByCauseArea[selectedCauseAreaId] || 0;
    totalOperationsAmount = Math.round((causeAreaAmount * percentage) / 100);
  }

  result.operationsAmount = totalOperationsAmount;

  if (selectionType === "multiple" && smartDistributionTotal && smartDistributionTotal > 0) {
    const reduction =
      multipleTotalDonation > 0 ? 1 - totalOperationsAmount / multipleTotalDonation : 1;
    const netSmartDistributionAmount = smartDistributionTotal * reduction;

    causeAreas.forEach((area) => {
      if (area.standardPercentageShare && area.standardPercentageShare > 0) {
        const areaAmount = (area.standardPercentageShare / 100) * netSmartDistributionAmount;
        result.causeAreaAmounts[area.id] = (result.causeAreaAmounts[area.id] || 0) + areaAmount;

        area.organizations.forEach((org) => {
          if (org.standardShare && org.standardShare > 0) {
            result.organizationAmounts[org.id] =
              (result.organizationAmounts[org.id] || 0) + (org.standardShare / 100) * areaAmount;
          }
        });
      }
    });
  }

  // Process each cause area
  causeAreas.forEach((area) => {
    // Skip areas not relevant to current selection
    if (selectionType === "single" && area.id !== selectedCauseAreaId) {
      return;
    }
    // In multiple mode, cause areas the platform excludes from the shared pot (and the
    // operations cause area itself) are entered separately rather than as part of the split.
    if (
      selectionType === "multiple" &&
      (ignoredCauseAreas.includes(area.id) || area.id === operationsCauseAreaId)
    ) {
      return;
    }

    const areaAmount = causeAreaAmounts[area.id] || 0;
    if (areaAmount === 0 && causeAreaDistributionType[area.id] !== ShareType.CUSTOM) {
      return;
    }

    if (causeAreaDistributionType[area.id] === ShareType.STANDARD) {
      let netAreaAmount = areaAmount;

      // Apply cuts
      if (
        selectionType === "single" &&
        area.id === selectedCauseAreaId &&
        operationsPercentageModeByCauseArea[area.id]
      ) {
        const percentage = operationsPercentageByCauseArea[area.id] || 0;
        const operationsCut = Math.round((areaAmount * percentage) / 100);
        netAreaAmount = areaAmount - operationsCut;
      } else if (selectionType === "multiple" && totalOperationsAmount > 0) {
        // For multiple cause areas we need to spread the operations cut proportionally
        const share = areaAmount / multipleTotalDonation;
        const operationsCut = totalOperationsAmount * share;
        netAreaAmount = areaAmount - operationsCut;
      }

      result.causeAreaAmounts[area.id] = (result.causeAreaAmounts[area.id] || 0) + netAreaAmount;

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
        if (
          selectionType === "single" &&
          area.id === selectedCauseAreaId &&
          operationsPercentageModeByCauseArea[area.id]
        ) {
          const percentage = operationsPercentageByCauseArea[area.id] || 0;
          const operationsCut = Math.round((totalOrgAmount * percentage) / 100);
          netTotalOrgAmount = totalOrgAmount - operationsCut;
          if (operationsCut > 0 && totalOrgAmount > 0) {
            reduction = 1 - operationsCut / totalOrgAmount;
          }
        } else if (selectionType === "multiple" && totalOperationsAmount > 0) {
          // For multiple cause areas we need to spread the operations cut proportionally
          const share = totalOrgAmount / multipleTotalDonation;
          const operationsCut = totalOperationsAmount * share;
          netTotalOrgAmount = totalOrgAmount - operationsCut;
          if (operationsCut > 0 && totalOrgAmount > 0) {
            reduction = 1 - operationsCut / totalOrgAmount;
          }
        }

        result.causeAreaAmounts[area.id] =
          (result.causeAreaAmounts[area.id] || 0) + netTotalOrgAmount;

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

  const totalAmount = Math.round(
    Object.values(result.causeAreaAmounts).reduce((sum, amount) => sum + amount, 0) +
      result.operationsAmount,
  );
  const hasOperationsCut =
    (selectionType === "multiple" && globalOperationsEnabled) ||
    (selectionType === "single" &&
      selectedCauseAreaId !== null &&
      selectedCauseAreaId !== undefined &&
      operationsPercentageModeByCauseArea[selectedCauseAreaId]);
  const exactCauseAreaAmounts = { ...result.causeAreaAmounts };
  const roundedCauseAreaAmounts: Record<number, number> = {};

  Object.entries(exactCauseAreaAmounts).forEach(([id, amount]) => {
    const areaId = Number(id);
    const area = causeAreas.find((candidate) => candidate.id === areaId);
    const isCustom = causeAreaDistributionType[areaId] === ShareType.CUSTOM;
    roundedCauseAreaAmounts[areaId] = isCustom
      ? (area?.organizations || []).reduce(
          (sum, org) => sum + Math.round(result.organizationAmounts[org.id] || 0),
          0,
        )
      : Math.round(amount);
  });

  let roundedDistributedAmount = Object.values(roundedCauseAreaAmounts).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const largestCauseAreaId = Object.keys(roundedCauseAreaAmounts)
    .map(Number)
    .sort(
      (left, right) =>
        roundedCauseAreaAmounts[right] - roundedCauseAreaAmounts[left] || left - right,
    )[0];

  if (largestCauseAreaId !== undefined) {
    if (roundedDistributedAmount > totalAmount) {
      roundedCauseAreaAmounts[largestCauseAreaId] -= roundedDistributedAmount - totalAmount;
      roundedDistributedAmount = totalAmount;
    } else if (!hasOperationsCut && roundedDistributedAmount < totalAmount) {
      roundedCauseAreaAmounts[largestCauseAreaId] += totalAmount - roundedDistributedAmount;
      roundedDistributedAmount = totalAmount;
    }
  }

  result.causeAreaAmounts = roundedCauseAreaAmounts;
  result.operationsAmount = hasOperationsCut ? totalAmount - roundedDistributedAmount : 0;
  result.totalAmount = totalAmount;

  causeAreas.forEach((area) => {
    const areaAmount = result.causeAreaAmounts[area.id];
    if (areaAmount === undefined) return;

    const exactOrganizationAmounts = area.organizations
      .map((org) => ({ id: org.id, amount: result.organizationAmounts[org.id] || 0 }))
      .filter((org) => org.amount > 0);
    const roundedOrganizationAmounts = roundAmountsToTotal(exactOrganizationAmounts, areaAmount);

    area.organizations.forEach((org) => {
      delete result.organizationAmounts[org.id];
    });
    roundedOrganizationAmounts.forEach(({ id, amount }) => {
      result.organizationAmounts[id] = amount;
    });
  });

  return result;
}

function roundAmountsToTotal<T extends { id: number; amount: number }>(
  amounts: T[],
  targetTotal: number,
): T[] {
  if (amounts.length === 0 || targetTotal <= 0) return [];

  const rounded = amounts.map((item) => ({ ...item, amount: Math.floor(item.amount) }));
  let remainder = targetTotal - rounded.reduce((sum, item) => sum + item.amount, 0);
  const incrementOrder = amounts
    .map((item, index) => ({ index, fraction: item.amount - Math.floor(item.amount), id: item.id }))
    .sort((left, right) => right.fraction - left.fraction || left.id - right.id);

  for (let index = 0; remainder > 0; index++, remainder--) {
    rounded[incrementOrder[index % incrementOrder.length].index].amount += 1;
  }

  const decrementOrder = rounded
    .map((item, index) => ({ index, amount: item.amount, id: item.id }))
    .sort((left, right) => right.amount - left.amount || left.id - right.id);

  for (let index = 0; remainder < 0; index++) {
    const item = rounded[decrementOrder[index % decrementOrder.length].index];
    if (item.amount > 0) {
      item.amount -= 1;
      remainder += 1;
    }
  }

  return rounded.filter((item) => item.amount > 0);
}

export interface OrganizationSharePayload {
  id: number;
  percentageShare: string;
  // The organization's actual kroner amount, sent alongside percentageShare
  // so the backend can migrate to amount-based (rather than percentage-based)
  // distribution in the future without breaking existing consumers.
  amount: number;
}

/**
 * Converts a list of amounts into percentage shares of their total. Each
 * share is independently rounded to 8 decimals except the item with the
 * largest amount, which absorbs the rounding remainder - so the shares are
 * guaranteed to sum to exactly 100, even once re-parsed as floats, which the
 * backend requires for both cause area and organization-level splits.
 */
export function distributeSharesWithRemainder<T extends { id: number; amount: number }>(
  amounts: T[],
): (T & { percentageShare: string })[] {
  const total = amounts.reduce((sum, item) => sum + item.amount, 0);

  if (total <= 0) return [];

  const largestIndex = amounts.reduce(
    (maxIndex, item, index) => (item.amount > amounts[maxIndex].amount ? index : maxIndex),
    0,
  );
  const largest = amounts[largestIndex];
  const others = amounts.filter((_, index) => index !== largestIndex);

  const otherShares = others.map((item) => ({
    ...item,
    percentageShare: parseFloat(((item.amount / total) * 100).toFixed(8)).toString(),
  }));

  const sumOfOthers = otherShares.reduce(
    (sum, share) => sum + parseFloat(share.percentageShare),
    0,
  );

  return [...otherShares, { ...largest, percentageShare: (100 - sumOfOthers).toString() }];
}

/**
 * Converts organization amounts within a single cause area into percentage
 * shares of that cause area (not of the overall donation).
 */
export function calculateOrganizationSharesWithinCauseArea(
  organizationAmounts: { id: number; amount: number }[],
): OrganizationSharePayload[] {
  const totalAmount = Math.round(
    organizationAmounts.reduce((sum, organization) => sum + organization.amount, 0),
  );
  const roundedAmounts = roundAmountsToTotal(organizationAmounts, totalAmount);

  return distributeSharesWithRemainder(roundedAmounts).map((share) => ({
    id: share.id,
    percentageShare: share.percentageShare,
    amount: share.amount,
  }));
}

import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { ShareType } from "../../../types/Enums";
import { SummmaryOrganizationsList, TotalTable } from "./DonationSummary.style";
import { calculateDonationBreakdown } from "../../../utils/donationCalculations";

interface DonationSummaryProps {
  /** Whether to show as compact summary (smaller font, less spacing) */
  compact?: boolean;
  /** Custom title for the summary */
  title?: string;
}

export const DonationSummary: React.FC<DonationSummaryProps> = ({ compact = false, title }) => {
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];

  const {
    selectionType,
    causeAreaAmounts = {},
    orgAmounts = {},
    causeAreaDistributionType = {},
    selectedCauseAreaId,
    recurring,
    operationsAmountsByCauseArea = {},
    smartDistributionTotal = 0,
    globalOperationsEnabled = false,
    globalOperationsAmount = 0,
  } = donation;

  const { summaryItems, sum } = React.useMemo(() => {
    const summaryItems: Array<{
      id: number;
      name: string;
      amount: number;
      orgs?: Array<{ id: number; name: string; amount: number }>;
    }> = [];

    // Special handling for smart distribution mode
    if (selectedCauseAreaId === -1 && smartDistributionTotal > 0) {
      summaryItems.push({
        id: -1,
        name: "Smart distribution",
        amount: smartDistributionTotal,
        orgs: [],
      });
      return { summaryItems, sum: smartDistributionTotal };
    }

    // Use the centralized calculation function
    const breakdown = calculateDonationBreakdown(
      causeAreaAmounts,
      orgAmounts,
      causeAreaDistributionType,
      operationsAmountsByCauseArea,
      causeAreas,
      selectionType || "single",
      selectedCauseAreaId,
      globalOperationsEnabled,
      smartDistributionTotal,
      globalOperationsAmount,
    );

    // Build summary items from breakdown
    causeAreas.forEach((area) => {
      const areaAmount = breakdown.causeAreaAmounts[area.id];
      if (!areaAmount || areaAmount <= 0) return;

      const orgs: Array<{ id: number; name: string; amount: number }> = [];

      // Add organization breakdown if custom distribution
      if (causeAreaDistributionType[area.id] === ShareType.CUSTOM) {
        area.organizations.forEach((org) => {
          const orgAmount = breakdown.organizationAmounts[org.id];
          if (orgAmount && orgAmount > 0) {
            orgs.push({
              id: org.id,
              name: org.name,
              amount: orgAmount,
            });
          }
        });
      }

      summaryItems.push({
        id: area.id,
        name: area.name,
        amount: areaAmount,
        orgs: orgs.length > 0 ? orgs : undefined,
      });
    });

    // Add operations if present
    if (breakdown.operationsAmount > 0) {
      summaryItems.push({
        id: 4,
        name: "Drift",
        amount: breakdown.operationsAmount,
        orgs: [],
      });
    }

    return { summaryItems, sum: breakdown.totalAmount };
  }, [
    selectionType,
    causeAreaAmounts,
    orgAmounts,
    causeAreas,
    selectedCauseAreaId,
    causeAreaDistributionType,
    operationsAmountsByCauseArea,
    globalOperationsEnabled,
    smartDistributionTotal,
    globalOperationsAmount,
  ]);

  if (sum === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: compact ? "15px" : "20px" }} data-cy="donation-summary">
      <SummmaryOrganizationsList
        cellSpacing={0}
        style={{
          fontSize: compact ? "14px" : "16px",
          marginBottom: compact ? "10px" : "15px",
        }}
      >
        {title && (
          <tr>
            <td
              colSpan={2}
              style={{ textAlign: "left", fontWeight: "bold", paddingBottom: "8px" }}
              data-cy="summary-title"
            >
              {title}
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={2} style={{ textAlign: "left" }} data-cy="donation-type">
            {recurring ? "Månadsgivande" : "Enkelt givande"} donation
          </td>
        </tr>
        {summaryItems.map((item) => (
          <React.Fragment key={item.id}>
            <tr
              data-cy={
                item.id === -1 ? "summary-smart-distribution" : `summary-cause-area-${item.id}`
              }
            >
              <td
                data-cy={
                  item.id === -1
                    ? "summary-smart-distribution-name"
                    : `summary-cause-area-${item.id}-name`
                }
              >
                <strong>{item.name}</strong>
              </td>
              <td
                data-cy={
                  item.id === -1
                    ? "summary-smart-distribution-amount"
                    : `summary-cause-area-${item.id}-amount`
                }
              >
                {(!item.orgs || item.orgs.length === 0) &&
                  item.amount.toLocaleString("no-NB") + " kr"}
              </td>
            </tr>
            {item.orgs &&
              item.orgs.map((org) => (
                <tr key={org.id}>
                  <td style={{ paddingLeft: 20 }} data-cy={`summary-org-${org.id}-name`}>
                    {org.name}
                  </td>
                  <td data-cy={`summary-org-${org.id}-amount`}>
                    {org.amount.toLocaleString("no-NB")} kr
                  </td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </SummmaryOrganizationsList>

      <TotalTable style={{ fontSize: compact ? "14px" : "16px" }}>
        <tr>
          <td data-cy="summary-total-label">Sum</td>
          <td data-cy="summary-total-amount">{sum.toLocaleString("no-NB")} kr</td>
        </tr>
      </TotalTable>
    </div>
  );
};

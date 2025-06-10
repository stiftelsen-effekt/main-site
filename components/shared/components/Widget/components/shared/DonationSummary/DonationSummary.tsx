import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { ShareType } from "../../../types/Enums";
import { SummmaryOrganizationsList, TotalTable } from "./DonationSummary.style";

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
  } = donation;

  // Calculate total operations amount from all per-cause-area operations
  const totalOperationsAmount = Object.values(operationsAmountsByCauseArea).reduce(
    (sum, amount) => sum + (amount || 0),
    0,
  );

  const { summaryItems, sum } = React.useMemo(() => {
    const summaryItems: Array<{
      id: number;
      name: string;
      amount: number;
      orgs?: Array<{ id: number; name: string; amount: number }>;
    }> = [];
    let sum = 0;

    // Special handling for smart distribution mode
    if (selectedCauseAreaId === -1 && smartDistributionTotal > 0) {
      summaryItems.push({
        id: -1,
        name: "Smart distribution",
        amount: smartDistributionTotal,
        orgs: [],
      });
      sum = smartDistributionTotal;
    } else {
      // Regular handling for single/multiple cause areas
      causeAreas.forEach((area) => {
        if (selectionType === "single" && area.id !== selectedCauseAreaId && area.id !== 4) {
          return;
        }
        if (
          selectionType === "multiple" &&
          selectedCauseAreaId === -1 &&
          (!area.standardPercentageShare || area.standardPercentageShare == 0)
        ) {
          return;
        }
        if (selectionType === "multiple" && area.id === 5) {
          return;
        }

        const areaAmount = causeAreaAmounts[area.id];

        if (areaAmount && causeAreaDistributionType[area.id] === ShareType.STANDARD) {
          if (areaAmount > 0) {
            summaryItems.push({
              id: area.id,
              name: area.name,
              amount: areaAmount,
              orgs: [],
            });
            sum += areaAmount;
          }
        } else if (causeAreaDistributionType[area.id] === ShareType.CUSTOM) {
          const orgs = area.organizations
            .filter((org) => orgAmounts[org.id] > 0)
            .map((org) => ({
              id: org.id,
              name: org.name,
              amount: orgAmounts[org.id] || 0,
            }));
          if (orgs.length > 0) {
            const totalOrgAmount = orgs.reduce((acc, org) => acc + org.amount, 0);

            summaryItems.push({
              id: area.id,
              name: area.name,
              amount: totalOrgAmount,
              orgs,
            });
            sum += totalOrgAmount;
          }
        }
      });

      // Add operations as a separate item if there's any operations amount
      // BUT NOT when in smart distribution mode (selectedCauseAreaId === -1)
      if (totalOperationsAmount > 0 && selectedCauseAreaId !== -1) {
        summaryItems.push({
          id: 4, // Operations cause area ID
          name: "Drift",
          amount: totalOperationsAmount,
          orgs: [],
        });
        sum += totalOperationsAmount;
      }
    }

    return { summaryItems, sum };
  }, [
    selectionType,
    causeAreaAmounts,
    orgAmounts,
    causeAreas,
    selectedCauseAreaId,
    causeAreaDistributionType,
    totalOperationsAmount,
    smartDistributionTotal,
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
                {item.orgs && item.orgs.length == 0 && item.amount.toLocaleString("no-NB") + " kr"}
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

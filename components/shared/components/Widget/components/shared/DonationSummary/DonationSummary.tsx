import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { ShareType } from "../../../types/Enums";
import {
  DonationSummaryHeader,
  DonationSummaryWrapper,
  SummmaryOrganizationsList,
  TotalTable,
} from "./DonationSummary.style";
import { calculateDonationBreakdown } from "../../../utils/donationCalculations";

export interface DonationSummaryText {
  single_donation_text: string;
  monthly_donation_text: string;
  smart_distribution_title: string;
  operations_summary_label: string;
  total_label: string;
}

export const DonationSummary: React.FC<{ text: DonationSummaryText }> = ({ text }) => {
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];

  const {
    selectionType,
    causeAreaAmounts = {},
    orgAmounts = {},
    causeAreaDistributionType = {},
    selectedCauseAreaId,
    recurring,
    operationsPercentageModeByCauseArea = {},
    operationsPercentageByCauseArea = {},
    smartDistributionTotal = 0,
    globalOperationsEnabled = false,
    globalOperationsPercentage = 5,
    operationsConfig,
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
        name: text.smart_distribution_title || "Smart distribution",
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
      operationsPercentageModeByCauseArea,
      operationsPercentageByCauseArea,
      causeAreas,
      selectionType || "single",
      selectedCauseAreaId,
      globalOperationsEnabled,
      globalOperationsPercentage,
      operationsConfig?.excludedCauseAreaIds || [],
      operationsConfig?.operationsCauseAreaId,
      smartDistributionTotal,
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

    // Add operations if present. Requires a configured operations cause area - the cut is
    // reported as a separate line for it, so there is nothing to attribute it to otherwise.
    if (breakdown.operationsAmount > 0 && operationsConfig?.operationsCauseAreaId !== undefined) {
      summaryItems.push({
        id: operationsConfig.operationsCauseAreaId,
        name: text.operations_summary_label,
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
    operationsPercentageModeByCauseArea,
    operationsPercentageByCauseArea,
    globalOperationsEnabled,
    smartDistributionTotal,
    globalOperationsPercentage,
    text.smart_distribution_title,
    text.operations_summary_label,
  ]);

  if (sum === 0) {
    return null;
  }

  return (
    <DonationSummaryWrapper data-cy="donation-summary">
      <DonationSummaryHeader data-cy="donation-type">
        {recurring ? text.monthly_donation_text : text.single_donation_text}
      </DonationSummaryHeader>
      <SummmaryOrganizationsList cellSpacing={0}>
        <tbody>
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
                    `${item.amount !== Math.round(item.amount) ? "~" : ""} ${Math.round(
                      item.amount,
                    ).toLocaleString("no-NB")} kr`}
                </td>
              </tr>
              {item.orgs &&
                item.orgs.map((org) => (
                  <tr key={org.id}>
                    <td style={{ paddingLeft: 40 }} data-cy={`summary-org-${org.id}-name`}>
                      {org.name}
                    </td>
                    <td data-cy={`summary-org-${org.id}-amount`}>
                      {org.amount !== Math.round(org.amount) ? "~" : null}{" "}
                      {Math.round(org.amount).toLocaleString("no-NB")} kr
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </SummmaryOrganizationsList>

      <TotalTable>
        <tbody>
          <tr>
            <td data-cy="summary-total-label">{text.total_label}</td>
            <td data-cy="summary-total-amount">{sum.toLocaleString("no-NB")} kr</td>
          </tr>
        </tbody>
      </TotalTable>
    </DonationSummaryWrapper>
  );
};

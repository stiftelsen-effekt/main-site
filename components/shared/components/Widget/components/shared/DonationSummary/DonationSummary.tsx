import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { ShareType } from "../../../types/Enums";
import { SummmaryOrganizationsList, TotalTable } from "../../panes/SummaryPane/SummaryPane.style";

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
  } = donation;

  const { summaryItems, sum } = React.useMemo(() => {
    const summaryItems: Array<{
      id: number;
      name: string;
      amount: number;
      orgs?: Array<{ id: number; name: string; amount: number }>;
    }> = [];
    let sum = 0;

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

    return { summaryItems, sum };
  }, [
    selectionType,
    causeAreaAmounts,
    orgAmounts,
    causeAreas,
    selectedCauseAreaId,
    causeAreaDistributionType,
  ]);

  if (sum === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: compact ? "15px" : "20px" }}>
      <SummmaryOrganizationsList
        cellSpacing={0}
        style={{
          fontSize: compact ? "14px" : "16px",
          marginBottom: compact ? "10px" : "15px",
        }}
      >
        {title && (
          <tr>
            <td colSpan={2} style={{ textAlign: "left", fontWeight: "bold", paddingBottom: "8px" }}>
              {title}
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={2} style={{ textAlign: "left" }}>
            {recurring ? "Månadsgivande" : "Enkelt givande"} donation
          </td>
        </tr>
        {summaryItems.map((item) => (
          <React.Fragment key={item.id}>
            <tr>
              <td>
                <strong>{item.name}</strong>
              </td>
              <td>
                {item.orgs && item.orgs.length == 0 && item.amount.toLocaleString("no-NB") + " kr"}
              </td>
            </tr>
            {item.orgs &&
              item.orgs.map((org) => (
                <tr key={org.id}>
                  <td style={{ paddingLeft: 20 }}>{org.name}</td>
                  <td>{org.amount.toLocaleString("no-NB")} kr</td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </SummmaryOrganizationsList>

      <TotalTable style={{ fontSize: compact ? "14px" : "16px" }}>
        <tr>
          <td>Sum</td>
          <td>{sum.toLocaleString("no-NB")} kr</td>
        </tr>
      </TotalTable>
    </div>
  );
};

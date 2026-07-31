import { DonationImpactEntry } from "../../../../../models";
import { CauseArea } from "../../../../shared/components/Widget/types/CauseArea";
import { Organization } from "../../../../shared/components/Widget/types/Organization";

type ImpactCauseArea = Pick<CauseArea, "id" | "name">;
type ImpactOrganization = Pick<Organization, "name" | "causeAreaId">;

export type DonationImpactGroup = {
  causeArea: ImpactCauseArea;
  impact: DonationImpactEntry[];
  showTitle: boolean;
};

export const groupDonationImpactByCauseArea = (
  impact: DonationImpactEntry[],
  organizations: ImpactOrganization[],
  causeAreas: ImpactCauseArea[],
): DonationImpactGroup[] => {
  const groupedImpact = new Map<number, DonationImpactEntry[]>();

  impact.forEach((entry) => {
    const causeAreaId = organizations.find(
      (organization) => organization.name === entry.organization,
    )?.causeAreaId;
    if (causeAreaId === undefined) return;
    groupedImpact.set(causeAreaId, [...(groupedImpact.get(causeAreaId) ?? []), entry]);
  });

  const groups = causeAreas
    .filter((causeArea) => groupedImpact.has(causeArea.id))
    .map((causeArea) => ({
      causeArea,
      impact: groupedImpact.get(causeArea.id) ?? [],
      showTitle: false,
    }));

  return groups.map((group) => ({ ...group, showTitle: groups.length > 1 }));
};

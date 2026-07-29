import { Distribution, DistributionCauseArea } from "../../../models";
import { distributeSharesWithRemainder } from "../../shared/components/Widget/utils/donationCalculations";
import { CauseArea } from "../../shared/components/Widget/types/CauseArea";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const isAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export const isAllocationVisible = (
  isActive: boolean | undefined,
  savedAmount?: number,
  standardPercentageShare?: number,
) => isActive !== false || (savedAmount ?? 0) > 0 || (standardPercentageShare ?? 0) > 0;

export const orderDistributionCauseAreas = (
  causeAreas: DistributionCauseArea[],
  systemCauseAreas: Pick<CauseArea, "id" | "ordering">[],
) => {
  const ordering = new Map(systemCauseAreas.map((causeArea) => [causeArea.id, causeArea.ordering]));
  return [...causeAreas].sort(
    (a, b) =>
      (ordering.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (ordering.get(b.id) ?? Number.MAX_SAFE_INTEGER),
  );
};

export const getStandardOrganizationId = (causeArea: CauseArea) =>
  causeArea.organizations.find((organization) => (organization.standardShare ?? 0) > 0)?.id ??
  causeArea.organizations[0]?.id;

export const getStandardOrganizationIds = (causeAreas: CauseArea[]) =>
  new Map(
    causeAreas.flatMap((causeArea) => {
      const organizationId = getStandardOrganizationId(causeArea);
      return organizationId === undefined ? [] : [[causeArea.id, organizationId] as const];
    }),
  );

export const setStandardCauseAreaAmount = (
  causeArea: DistributionCauseArea,
  amount: number,
  standardOrganizationId: number,
): DistributionCauseArea => {
  const organizations = causeArea.organizations.some(
    (organization) => organization.id === standardOrganizationId,
  )
    ? causeArea.organizations
    : [
        ...causeArea.organizations,
        { id: standardOrganizationId, percentageShare: "100", amount: 0 },
      ];

  return {
    ...causeArea,
    amount,
    organizations: organizations.map((organization) =>
      organization.id === standardOrganizationId ? { ...organization, amount } : organization,
    ),
  };
};

export const setCauseAreaStandardSplit = (
  causeArea: DistributionCauseArea,
  standardSplit: boolean,
): DistributionCauseArea => ({
  ...causeArea,
  standardSplit,
  amount: causeArea.organizations.reduce(
    (total, organization) => total + (organization.amount ?? 0),
    0,
  ),
});

const allocateTotal = <T extends { percentageShare: string }>(total: number, items: T[]) => {
  if (items.length === 0) return [];

  const roundedTotal = Math.max(0, Math.round(total));
  const weights = items.map((item) => Math.max(0, parseFloat(item.percentageShare) || 0));
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const effectiveWeights =
    weightTotal > 0 ? weights : items.map((_, index) => (index === 0 ? 1 : 0));
  const effectiveTotal = effectiveWeights.reduce((sum, weight) => sum + weight, 0);
  const exactAmounts = effectiveWeights.map((weight) => (weight / effectiveTotal) * roundedTotal);
  const amounts = exactAmounts.map(Math.floor);
  const remainder = roundedTotal - amounts.reduce((sum, amount) => sum + amount, 0);
  const remainderOrder = exactAmounts
    .map((amount, index) => ({ index, fraction: amount - Math.floor(amount) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (let index = 0; index < remainder; index += 1) {
    amounts[remainderOrder[index % remainderOrder.length].index] += 1;
  }

  return amounts;
};

const hydrateOrganizations = (causeArea: DistributionCauseArea, amount: number) => {
  const organizations = clone(causeArea.organizations);
  if (organizations.every((organization) => isAmount(organization.amount))) return organizations;

  const amounts = allocateTotal(amount, organizations);
  return organizations.map((organization, index) => ({ ...organization, amount: amounts[index] }));
};

export const hydrateDistributionAmounts = (
  distribution: Distribution,
  donationAmount: number,
): Distribution => {
  const next = clone(distribution);
  const causeAreaAmounts = next.causeAreas.every((causeArea) => isAmount(causeArea.amount))
    ? next.causeAreas.map((causeArea) => causeArea.amount as number)
    : allocateTotal(donationAmount, next.causeAreas);

  next.causeAreas = next.causeAreas.map((causeArea, index) => {
    const amount = causeAreaAmounts[index];
    return {
      ...causeArea,
      amount,
      organizations: hydrateOrganizations(causeArea, amount),
    };
  });

  return next;
};

export const prepareDistributionForSave = (
  distribution: Distribution,
  donationAmount: number,
  standardOrganizationIds: Map<number, number> = new Map(),
): Distribution => {
  if (!Number.isInteger(donationAmount) || donationAmount <= 0) {
    throw new Error("Donation amount must be a positive whole number");
  }

  const activeCauseAreas = distribution.causeAreas.filter(
    (causeArea) => isAmount(causeArea.amount) && causeArea.amount > 0,
  );
  const causeAreaTotal = activeCauseAreas.reduce(
    (sum, causeArea) => sum + (causeArea.amount as number),
    0,
  );

  if (causeAreaTotal !== donationAmount) {
    throw new Error("Cause area amounts must sum to donation amount");
  }

  const causeAreaShares = distributeSharesWithRemainder(
    activeCauseAreas.map((causeArea) => ({ id: causeArea.id, amount: causeArea.amount as number })),
  );
  const causeAreaShareById = new Map(
    causeAreaShares.map((causeArea) => [causeArea.id, causeArea.percentageShare]),
  );

  return {
    ...clone(distribution),
    causeAreas: activeCauseAreas.map((causeArea) => {
      const amount = causeArea.amount as number;
      const standardOrganizationId = standardOrganizationIds.get(causeArea.id);
      const standardOrganization = causeArea.organizations.find(
        (organization) => organization.id === standardOrganizationId,
      );
      const organizations =
        causeArea.standardSplit && standardOrganizationId !== undefined
          ? [
              {
                ...standardOrganization,
                id: standardOrganizationId,
                percentageShare: "100",
                amount,
              },
            ]
          : causeArea.standardSplit
          ? hydrateOrganizations(causeArea, amount)
          : causeArea.organizations;
      const activeOrganizations = organizations.filter(
        (organization) => isAmount(organization.amount) && organization.amount > 0,
      );
      const organizationTotal = activeOrganizations.reduce(
        (sum, organization) => sum + (organization.amount as number),
        0,
      );

      if (organizationTotal !== amount) {
        throw new Error("Organization amounts must sum to cause area amount");
      }

      const organizationShares = distributeSharesWithRemainder(
        activeOrganizations.map((organization) => ({
          id: organization.id,
          amount: organization.amount as number,
        })),
      );
      const organizationShareById = new Map(
        organizationShares.map((organization) => [organization.id, organization.percentageShare]),
      );

      return {
        ...causeArea,
        amount,
        percentageShare: causeAreaShareById.get(causeArea.id) as string,
        organizations: activeOrganizations.map((organization) => ({
          ...organization,
          amount: organization.amount as number,
          percentageShare: organizationShareById.get(organization.id) as string,
        })),
      };
    }),
  };
};

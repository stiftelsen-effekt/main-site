import { DKAgreement, Distribution, TaxUnit } from "../../../../../models";

export const MEMBERSHIP_ORGANIZATION_ID = 99;

const MEMBERSHIP_ORGANIZATION_NAME = "Giv Effektivts medlemskab";

export function distributionTargetsMembershipFee(
  distribution: Distribution | null | undefined,
): boolean {
  if (!distribution?.causeAreas?.length) {
    return false;
  }

  return distribution.causeAreas.some((causeArea) =>
    causeArea.organizations?.some(
      (org) =>
        org.id === MEMBERSHIP_ORGANIZATION_ID || org.name?.trim() === MEMBERSHIP_ORGANIZATION_NAME,
    ),
  );
}

export function getDKMembershipDisplay(params: {
  agreement: DKAgreement;
  distribution: Distribution | null | undefined;
  taxUnits: TaxUnit[];
}): string | null {
  if (!distributionTargetsMembershipFee(params.distribution)) {
    return null;
  }

  const fromApi = params.agreement.membershipDisplayName?.trim();
  if (fromApi) {
    return fromApi;
  }

  const taxUnitId = params.distribution?.taxUnitId;
  if (taxUnitId == null) {
    return null;
  }

  const unit = params.taxUnits.find((u) => u.id === taxUnitId);
  if (!unit || unit.archived !== null) {
    return null;
  }

  return formatMembershipFromTaxUnit(unit);
}

function formatMembershipFromTaxUnit(unit: TaxUnit): string | null {
  const name = unit.name?.trim() ?? "";
  const ssn = unit.ssn?.trim() ?? "";
  if (name && ssn) {
    return `${name} ${ssn}`;
  }
  if (name) {
    return name;
  }
  if (ssn) {
    return ssn;
  }
  return null;
}

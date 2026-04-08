import { DKAgreement, Distribution, TaxUnit } from "../../../../../models";

export function getDKMembershipDisplay(params: {
  agreement: DKAgreement;
  distribution: Distribution | null | undefined;
  taxUnits: TaxUnit[];
}): string | null {
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

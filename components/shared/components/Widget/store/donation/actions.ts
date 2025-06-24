import actionCreatorFactory from "typescript-fsa";
import {
  DonationActionTypes,
  SELECT_PAYMENT_METHOD,
  SELECT_TAX_DEDUCTION,
  SUBMIT_DONOR_INFO,
  SET_SUM,
  SET_RECURRING,
  SET_SHARES,
  SET_DONOR_ID,
  SET_KID,
  SET_PAYMENT_PROVIDER_URL,
  SELECT_CUSTOM_SHARE,
  SET_SHARE_TYPE,
  SET_DUE_DAY,
  SET_VIPPS_AGREEMENT,
  SET_CAUSE_AREA_PERCENTAGE_SHARE,
  SET_ORG_AMOUNT,
  SET_CAUSE_AREA_AMOUNT,
  SET_CAUSE_AREA_DISTRIBUTION_TYPE,
  SET_CAUSE_AREA_SELECTION,
  SET_OPERATIONS_AMOUNT_BY_CAUSE_AREA,
  SET_SMART_DISTRIBUTION_TOTAL,
  SET_GLOBAL_OPERATIONS_USER_OVERRIDE,
  SET_GLOBAL_OPERATIONS_ENABLED,
  SET_GLOBAL_OPERATIONS_AMOUNT,
  SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA,
} from "./types";
import { PaymentMethod, RecurringDonation, ShareType } from "../../types/Enums";
import { DraftAgreementResponse, OrganizationShare } from "../../types/Temp";
import { VippsAgreement } from "../state";
import { DistributionCauseAreaOrganization } from "../../types/DistributionCauseAreaOrganization";

const actionCreator = actionCreatorFactory();

export function selectPaymentMethod(method: PaymentMethod): DonationActionTypes {
  return {
    type: SELECT_PAYMENT_METHOD,
    payload: {
      method,
    },
  };
}

export function selectTaxDeduction(taxDeduction: boolean): DonationActionTypes {
  return {
    type: SELECT_TAX_DEDUCTION,
    payload: {
      taxDeduction,
    },
  };
}

export function submitDonorInfo(data: {
  name: string;
  email: string;
  taxDeduction: boolean;
  ssn: string;
  newsletter: boolean;
}): DonationActionTypes {
  return {
    type: SUBMIT_DONOR_INFO,
    payload: data,
  };
}

export function setShares(
  causeAreaId: number,
  shares: DistributionCauseAreaOrganization[],
): DonationActionTypes {
  return {
    type: SET_SHARES,
    payload: {
      causeAreaId,
      shares,
    },
  };
}

export function setSum(sum: number): DonationActionTypes {
  return {
    type: SET_SUM,
    payload: {
      sum,
    },
  };
}

export function setDueDay(day: number): DonationActionTypes {
  return {
    type: SET_DUE_DAY,
    payload: {
      day,
    },
  };
}

export function setRecurring(recurring: RecurringDonation): DonationActionTypes {
  return {
    type: SET_RECURRING,
    payload: {
      recurring,
    },
  };
}

export function setDonorID(donorID: number): DonationActionTypes {
  return {
    type: SET_DONOR_ID,
    payload: {
      donorID,
    },
  };
}

export function setKID(kid: string): DonationActionTypes {
  return {
    type: SET_KID,
    payload: {
      kid,
    },
  };
}

export function setPaymentProviderURL(url: string): DonationActionTypes {
  return {
    type: SET_PAYMENT_PROVIDER_URL,
    payload: {
      url,
    },
  };
}

export function selectCustomShare(causeAreaId: number, customShare: boolean): DonationActionTypes {
  return {
    type: SELECT_CUSTOM_SHARE,
    payload: {
      causeAreaId,
      customShare,
    },
  };
}

export function setCauseAreaPercentageShare(
  causeAreaId: number,
  percentageShare: string,
): DonationActionTypes {
  return {
    type: SET_CAUSE_AREA_PERCENTAGE_SHARE,
    payload: {
      causeAreaId,
      percentageShare,
    },
  };
}

export function setVippsAgreement(vippsAgreement: VippsAgreement): DonationActionTypes {
  return {
    type: SET_VIPPS_AGREEMENT,
    payload: {
      vippsAgreement,
    },
  };
}
/**
 * Select whether donating to a single cause area or multiple cause areas.
 */
export function setCauseAreaSelection(
  selectionType: "single" | "multiple",
  causeAreaId?: number,
): DonationActionTypes {
  return {
    type: SET_CAUSE_AREA_SELECTION,
    payload: { selectionType, causeAreaId },
  };
}
/**
 * Set the entered amount for a specific cause area (in NOK).
 */
export function setCauseAreaAmount(causeAreaId: number, amount: number): DonationActionTypes {
  return {
    type: SET_CAUSE_AREA_AMOUNT,
    payload: { causeAreaId, amount },
  };
}

/**
 * Set the operations amount for a specific cause area.
 */
export function setOperationsAmountByCauseArea(
  causeAreaId: number,
  operationsAmount: number,
): DonationActionTypes {
  return {
    type: SET_OPERATIONS_AMOUNT_BY_CAUSE_AREA,
    payload: { causeAreaId, operationsAmount },
  };
}

/**
 * Set the entered distribution type for a specific cause area.
 */
export function setCauseAreaDistributionType(
  causeAreaId: number,
  distributionType: ShareType,
): DonationActionTypes {
  return {
    type: SET_CAUSE_AREA_DISTRIBUTION_TYPE,
    payload: { causeAreaId, distributionType },
  };
}
/**
 * Set the entered amount for a specific organization (in NOK) when custom-splitting a single cause area.
 */
export function setOrgAmount(orgId: number, amount: number): DonationActionTypes {
  return {
    type: SET_ORG_AMOUNT,
    payload: { orgId, amount },
  };
}

/**
 * Set the total amount for smart distribution (in NOK).
 */
export function setSmartDistributionTotal(smartDistributionTotal: number): DonationActionTypes {
  return {
    type: SET_SMART_DISTRIBUTION_TOTAL,
    payload: { smartDistributionTotal },
  };
}

export function setGlobalOperationsUserOverride(
  hasUserOverride: boolean,
  overrideValue: boolean,
): DonationActionTypes {
  return {
    type: SET_GLOBAL_OPERATIONS_USER_OVERRIDE,
    payload: { hasUserOverride, overrideValue },
  };
}

/**
 * Set whether global operations cut is enabled for multiple cause areas.
 * This is separate from individual cause area operations amounts.
 */
export function setGlobalOperationsEnabled(enabled: boolean): DonationActionTypes {
  return {
    type: SET_GLOBAL_OPERATIONS_ENABLED,
    payload: { enabled },
  };
}

/**
 * Set the global operations cut amount for multiple cause areas.
 * This amount is not distributed - it's the total operations cut.
 */
export function setGlobalOperationsAmount(amount: number): DonationActionTypes {
  return {
    type: SET_GLOBAL_OPERATIONS_AMOUNT,
    payload: { amount },
  };
}

/**
 * Set whether to use percentage mode or custom amount mode for operations cut for a cause area.
 */
export function setOperationsPercentageModeByCauseArea(
  causeAreaId: number,
  isPercentageMode: boolean,
): DonationActionTypes {
  return {
    type: SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA,
    payload: { causeAreaId, isPercentageMode },
  };
}

/**
 * TODO: Find a place this can live
 */

export type RegisterDonationResponse = {
  KID: string;
  donorID: number;
  hasAnsweredReferral: boolean;
  paymentProviderUrl: string;
  swishOrderID: string;
  swishPaymentRequestToken: string;
};

export const draftAgreementAction = actionCreator.async<undefined, DraftAgreementResponse, Error>(
  "DRAFT_AGREEMENT",
);

export const draftAvtaleGiroAction = actionCreator.async<undefined, undefined, Error>(
  "DRAFT_AVTALEGIRO",
);

export const registerDonationAction = actionCreator.async<
  undefined,
  RegisterDonationResponse,
  Error
>("REGISTER_DONATION");

export const registerBankPendingAction = actionCreator.async<undefined, undefined, Error>(
  "REGISTER_BANK_PENDING",
);

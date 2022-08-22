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
  SET_DONATION_VALID,
  SET_DUE_DAY,
  SET_VIPPS_AGREEMENT,
} from "./types";
import { PaymentMethod, RecurringDonation, ShareType } from "../../types/Enums";
import { DraftAgreementResponse, OrganizationShare } from "../../types/Temp";
import { VippsAgreement } from "../state";

const actionCreator = actionCreatorFactory();

export function selectPaymentMethod(
  method: PaymentMethod
): DonationActionTypes {
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

export function submitDonorInfo(
  name: string,
  email: string,
  taxDeduction: boolean,
  ssn: string,
  newsletter: boolean
): DonationActionTypes {
  return {
    type: SUBMIT_DONOR_INFO,
    payload: {
      name,
      email,
      taxDeduction,
      ssn,
      newsletter,
    },
  };
}

export function setShares(shares: OrganizationShare[]): DonationActionTypes {
  return {
    type: SET_SHARES,
    payload: {
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

export function setRecurring(
  recurring: RecurringDonation
): DonationActionTypes {
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

export function selectCustomShare(customShare: boolean): DonationActionTypes {
  return {
    type: SELECT_CUSTOM_SHARE,
    payload: {
      customShare,
    },
  };
}

export function setShareType(shareType: ShareType): DonationActionTypes {
  return {
    type: SET_SHARE_TYPE,
    payload: {
      shareType,
    },
  };
}

export function setDonationValid(isValid: boolean): DonationActionTypes {
  return {
    type: SET_DONATION_VALID,
    payload: {
      isValid,
    },
  };
}

export function setVippsAgreement(
  vippsAgreement: VippsAgreement
): DonationActionTypes {
  return {
    type: SET_VIPPS_AGREEMENT,
    payload: {
      vippsAgreement,
    },
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
};

export const draftAgreementAction = actionCreator.async<
  undefined,
  DraftAgreementResponse,
  Error
>("DRAFT_AGREEMENT");

export const draftAvtaleGiroAction = actionCreator.async<
  undefined,
  undefined,
  Error
>("DRAFT_AVTALEGIRO");

export const registerDonationAction = actionCreator.async<
  undefined,
  RegisterDonationResponse,
  Error
>("REGISTER_DONATION");

export const registerBankPendingAction = actionCreator.async<
  undefined,
  undefined,
  Error
>("REGISTER_BANK_PENDING");

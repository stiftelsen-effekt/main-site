import { Reducer } from "redux";
import { isType } from "typescript-fsa";
import { getEarliestPossibleChargeDate } from "../../components/panes/PaymentPane/Bank/AvtaleGiroDatePicker/avtalegirodates";
import { RecurringDonation, ShareType } from "../../types/Enums";
import { OrganizationShare } from "../../types/Temp";
import { fetchOrganizationsAction } from "../layout/actions";
import { Donation } from "../state";
import { registerDonationAction } from "./actions";
import {
  DonationActionTypes,
  SELECT_PAYMENT_METHOD,
  SELECT_TAX_DEDUCTION,
  SUBMIT_DONOR_INFO,
  SET_SHARES,
  SET_SUM,
  SET_RECURRING,
  SET_KID,
  SET_DONOR_ID,
  SET_PAYMENT_PROVIDER_URL,
  SET_SHARE_TYPE,
  SELECT_CUSTOM_SHARE,
  SET_DONATION_VALID,
  SET_DUE_DAY,
  SET_VIPPS_AGREEMENT,
} from "./types";

const initialState: Donation = {
  recurring: RecurringDonation.RECURRING,
  shareType: ShareType.STANDARD,
  donor: {
    taxDeduction: false,
    newsletter: false,
  },
  isValid: false,
  shares: [],
  dueDay: getEarliestPossibleChargeDate(),
  vippsAgreement: {
    initialCharge: true,
    monthlyChargeDay: new Date().getDate() <= 28 ? new Date().getDate() : 0,
  },
};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Donation} state The current state of the Layout
 * @param {DonationActionTypes} action An action mutating the current Layout state
 */

export const donationReducer: Reducer<Donation, DonationActionTypes> = (
  state: Donation = initialState,
  action: DonationActionTypes
) => {
  if (isType(action, fetchOrganizationsAction.done)) {
    state = {
      ...state,
      shares: action.payload.result.map(
        (org): OrganizationShare => ({
          id: org.id,
          split: org.standardShare,
        })
      ),
    };
  }

  if (isType(action, registerDonationAction.done)) {
    state = {
      ...state,
      kid: action.payload.result.KID,
      paymentProviderURL: action.payload.result.paymentProviderUrl,
      donor: {
        ...state.donor,
        donorID: action.payload.result.donorID,
      },
    };
  }

  switch (action.type) {
    case SELECT_PAYMENT_METHOD:
      state = { ...state, method: action.payload.method };
      break;
    case SELECT_TAX_DEDUCTION:
      state = {
        ...state,
        donor: { ...state.donor, taxDeduction: action.payload.taxDeduction },
      };
      break;
    case SUBMIT_DONOR_INFO:
      state = {
        ...state,
        donor: {
          name: action.payload.name,
          email: action.payload.email,
          taxDeduction: action.payload.taxDeduction,
          ssn: action.payload.ssn,
          newsletter: action.payload.newsletter,
        },
      };
      break;
    case SET_SHARES:
      state = { ...state, shares: action.payload.shares };
      break;
    case SET_SUM:
      state = { ...state, sum: action.payload.sum };
      break;
    case SET_DUE_DAY:
      state = { ...state, dueDay: action.payload.day };
      break;
    case SET_RECURRING:
      state = { ...state, recurring: action.payload.recurring };
      break;
    case SET_KID:
      state = { ...state, kid: action.payload.kid };
      break;
    case SET_DONOR_ID:
      state = {
        ...state,
        donor: { ...state.donor, donorID: action.payload.donorID },
      };
      break;
    case SET_PAYMENT_PROVIDER_URL:
      state = { ...state, paymentProviderURL: action.payload.url };
      break;
    case SET_SHARE_TYPE:
      state = { ...state, shareType: action.payload.shareType };
      break;
    case SELECT_CUSTOM_SHARE:
      state = { ...state, shareType: ShareType.CUSTOM };
      break;
    case SET_DONATION_VALID:
      state = { ...state };
      break;
    case SET_VIPPS_AGREEMENT:
      state = {
        ...state,
        vippsAgreement: {
          ...state.vippsAgreement,
          ...action.payload.vippsAgreement,
        },
      };
      break;
    default:
      return state;
  }

  /**
   * Validate donation below
   * Parts of the validation is done directly inside DonationPane
   */

  if (
    state.shareType === ShareType.CUSTOM &&
    state.shares.reduce((acc, curr) => acc + curr.split, 0) !== 100
  )
    return { ...state, isValid: false };

  let negativeShare = false;
  state.shares.forEach((share) => {
    if (share.split < 0) {
      negativeShare = true;
    }
  });
  if (negativeShare) {
    return { ...state, isValid: false };
  }

  // Sum is checked for being an integer in DonorPane
  // If it is not an integer, sum is set to -1
  if (!state.sum || state.sum <= 0) {
    return { ...state, isValid: false };
  }

  return { ...state, isValid: true };
};

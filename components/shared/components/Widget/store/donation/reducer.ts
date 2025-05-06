import { isType } from "typescript-fsa";
import { getEarliestPossibleChargeDate } from "../../components/panes/PaymentPane/AvtaleGiro/AvtaleGiroDatePicker/avtalegirodates";
import { RecurringDonation, ShareType } from "../../types/Enums";
import { fetchCauseAreasAction } from "../layout/actions";
import { Donation } from "../state";
import { registerDonationAction } from "./actions";
import {
  DonationActionTypes,
  SELECT_PAYMENT_METHOD,
  SELECT_TAX_DEDUCTION,
  SUBMIT_DONOR_INFO,
  SET_RECURRING,
  SET_KID,
  SET_DONOR_ID,
  SET_PAYMENT_PROVIDER_URL,
  SET_DUE_DAY,
  SET_VIPPS_AGREEMENT,
  SET_CAUSE_AREA_SELECTION,
  SET_CAUSE_AREA_AMOUNT,
  SET_ORG_AMOUNT,
  SET_TIP_ENABLED,
  SET_CAUSE_AREA_DISTRIBUTION_TYPE,
} from "./types";
import { Reducer } from "@reduxjs/toolkit";

const initialState: Donation = {
  recurring: RecurringDonation.NON_RECURRING,
  donor: {
    taxDeduction: false,
    newsletter: false,
  },
  errors: [],
  showErrors: false,
  dueDay: getEarliestPossibleChargeDate(),
  vippsAgreement: {
    initialCharge: true,
    monthlyChargeDay: new Date().getDate() <= 28 ? new Date().getDate() : 0,
  },
  tipEnabled: true,
};

/**
 * The reducer is a pure function that takes in the previous state,
 * performs an action on that state and returns the new updated state.
 *
 * @param {Donation} state The current state of the Layout
 * @param {DonationActionTypes} action An action mutating the current Layout state
 */

export const donationReducer: Reducer<Donation, DonationActionTypes> = (
  state = initialState,
  action,
) => {
  if (isType(action, fetchCauseAreasAction.done)) {
    // Initialize distribution data and default UI selection
    const areas = action.payload.result;
    state = {
      ...state,
      // Default to single cause area (first) on load
      selectionType: areas.length > 0 ? "single" : undefined,
      selectedCauseAreaId: areas.length > 0 ? areas[0].id : undefined,
      causeAreaDistributionType: areas.reduce((acc, area) => {
        acc[area.id] = ShareType.STANDARD;
        return acc;
      }, {} as Record<number, ShareType>),
    };
  }

  if (isType(action, registerDonationAction.done)) {
    state = {
      ...state,
      kid: action.payload.result.KID,
      paymentProviderURL: action.payload.result.paymentProviderUrl,
      swishOrderID: action.payload.result.swishOrderID,
      swishPaymentRequestToken: action.payload.result.swishPaymentRequestToken,
      donor: {
        ...state.donor,
        donorID: action.payload.result.donorID,
      },
    };
  }

  // Handle UI selection and input actions before validation
  switch (action.type) {
    case SET_CAUSE_AREA_SELECTION: {
      const { selectionType, causeAreaId } = (action as any).payload;
      state = {
        ...state,
        selectionType,
        selectedCauseAreaId: causeAreaId,
        /* Reset all to 0 */
        causeAreaAmounts: {
          ...Object.keys(state.causeAreaAmounts ?? {}).reduce((acc, key) => {
            acc[parseInt(key)] = 0;
            return acc;
          }, {} as Record<number, number>),
        },
      };
      break;
    }
    case SET_CAUSE_AREA_AMOUNT: {
      const { causeAreaId, amount } = action.payload;
      const newAmounts = { ...(state.causeAreaAmounts ?? {}), [causeAreaId]: amount };

      state = {
        ...state,
        causeAreaAmounts: newAmounts,
      };
      break;
    }
    case SET_CAUSE_AREA_DISTRIBUTION_TYPE: {
      const { causeAreaId, distributionType } = action.payload;
      const newDistributionTypes = {
        ...(state.causeAreaDistributionType ?? {}),
        [causeAreaId]: distributionType,
      };

      state = {
        ...state,
        causeAreaDistributionType: newDistributionTypes,
      };
      break;
    }
    case SET_ORG_AMOUNT: {
      const { orgId, amount } = action.payload;
      const newOrgAmounts = { ...(state.orgAmounts ?? {}), [orgId]: amount };

      state = {
        ...state,
        orgAmounts: newOrgAmounts,
      };
      break;
    }
    case SET_TIP_ENABLED: {
      const { tipEnabled } = (action as any).payload;
      state = { ...state, tipEnabled };
      break;
    }
    default:
      // proceed to other action handlers
      break;
  }
  // Handle original action types
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
  const errors: typeof state.errors = [];

  // Sum is checked for being an integer in DonorPane
  // If it is not an integer, sum is set to -1

  if (errors.length > 0) {
    return { ...state, errors };
  }

  return { ...state, errors: [] };
};

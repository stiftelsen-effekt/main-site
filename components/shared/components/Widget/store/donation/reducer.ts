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
  SET_CAUSE_AREA_DISTRIBUTION_TYPE,
  SET_SMART_DISTRIBUTION_TOTAL,
  SET_GLOBAL_OPERATIONS_ENABLED,
  SET_GLOBAL_OPERATIONS_PERCENTAGE_MODE,
  SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA,
  SET_GLOBAL_OPERATIONS_PERCENTAGE,
  SET_OPERATIONS_PERCENTAGE_BY_CAUSE_AREA,
  SET_OPERATIONS_CONFIG,
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
  globalOperationsEnabled: false,
  globalOperationsPercentageMode: true,
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
  state = initialState,
  action,
) => {
  if (isType(action, fetchCauseAreasAction.done)) {
    // Initialize distribution data and default UI selection
    const areas = action.payload.result;
    const config = state.operationsConfig;

    state = {
      ...state,
      // Default to single cause area (first) on load only if not already set
      selectionType: state.selectionType ?? (areas.length > 0 ? "single" : undefined),
      selectedCauseAreaId:
        state.selectedCauseAreaId ?? (areas.length > 0 ? areas[0].id : undefined),
      causeAreaDistributionType: areas.reduce((acc, area) => {
        acc[area.id] = ShareType.STANDARD;
        return acc;
      }, {} as Record<number, ShareType>),
      // Initialize operations config if available
      operationsPercentageModeByCauseArea: config
        ? areas.reduce((acc, area) => {
            const isExcluded = config.excludedCauseAreaIds.includes(area.id);
            acc[area.id] = !isExcluded && config.enabledByDefaultSingle;
            return acc;
          }, {} as Record<number, boolean>)
        : {},
      operationsPercentageByCauseArea: config
        ? areas.reduce((acc, area) => {
            acc[area.id] = config.defaultPercentage;
            return acc;
          }, {} as Record<number, number>)
        : {},
      globalOperationsEnabled: config?.enabledByDefaultGlobal ?? false,
      globalOperationsPercentage: config?.defaultPercentage,
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

      // Preserve all existing cause area amounts - never reset them
      let newCauseAreaAmounts = state.causeAreaAmounts ?? {};

      // Preserve all amounts when switching between selections
      // Smart distribution will handle its own amount calculations when needed
      // This allows users to switch between selections without losing their previous inputs

      // Preserve operations state when switching modes
      let globalOperationsEnabled = state.globalOperationsEnabled || false;

      // Preserve the user's choice when switching between modes
      // Only reset if they haven't made any explicit choices yet

      state = {
        ...state,
        selectionType,
        selectedCauseAreaId: causeAreaId,
        causeAreaAmounts: newCauseAreaAmounts,
        globalOperationsEnabled,
        globalOperationsPercentageMode: state.globalOperationsPercentageMode,
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
    case SET_SMART_DISTRIBUTION_TOTAL: {
      const { smartDistributionTotal } = (action as any).payload;

      state = {
        ...state,
        smartDistributionTotal,
      };
      break;
    }
    case SET_GLOBAL_OPERATIONS_ENABLED: {
      const { enabled } = (action as any).payload;

      state = {
        ...state,
        globalOperationsEnabled: enabled,
      };
      break;
    }
    case SET_GLOBAL_OPERATIONS_PERCENTAGE_MODE: {
      const { isPercentageMode } = (action as any).payload;

      state = {
        ...state,
        globalOperationsPercentageMode: isPercentageMode,
      };
      break;
    }
    case SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA: {
      const { causeAreaId, isPercentageMode } = (action as any).payload;
      const newModes = {
        ...(state.operationsPercentageModeByCauseArea ?? {}),
        [causeAreaId]: isPercentageMode,
      };

      state = {
        ...state,
        operationsPercentageModeByCauseArea: newModes,
      };
      break;
    }
    case SET_GLOBAL_OPERATIONS_PERCENTAGE: {
      const { percentage } = (action as any).payload;

      state = {
        ...state,
        globalOperationsPercentage: percentage,
      };
      break;
    }
    case SET_OPERATIONS_PERCENTAGE_BY_CAUSE_AREA: {
      const { causeAreaId, percentage } = (action as any).payload;
      const newPercentages = {
        ...(state.operationsPercentageByCauseArea ?? {}),
        [causeAreaId]: percentage,
      };

      state = {
        ...state,
        operationsPercentageByCauseArea: newPercentages,
      };
      break;
    }
    case SET_OPERATIONS_CONFIG: {
      const config = (action as any).payload;
      state = {
        ...state,
        operationsConfig: config,
      };
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

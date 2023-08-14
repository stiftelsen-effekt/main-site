import { Reducer } from "redux";
import { isType } from "typescript-fsa";
import { getEarliestPossibleChargeDate } from "../../components/panes/PaymentPane/Bank/AvtaleGiroDatePicker/avtalegirodates";
import { RecurringDonation, ShareType } from "../../types/Enums";
import { OrganizationShare } from "../../types/Temp";
import { fetchCauseAreasAction } from "../layout/actions";
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
  SET_DUE_DAY,
  SET_VIPPS_AGREEMENT,
  SET_CAUSE_AREA_PERCENTAGE_SHARE,
  SUBMIT_PHONE_NUMBER,
} from "./types";
import { CauseArea } from "../../types/CauseArea";
import { DistributionCauseArea } from "../../types/DistributionCauseArea";
import { DistributionCauseAreaOrganization } from "../../types/DistributionCauseAreaOrganization";

const initialState: Donation = {
  recurring: RecurringDonation.RECURRING,
  donor: {
    taxDeduction: false,
    newsletter: false,
  },
  isValid: false,
  distributionCauseAreas: [],
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
  state = initialState,
  action,
) => {
  if (isType(action, fetchCauseAreasAction.done)) {
    console.log(
      action.payload.result
        .map((causeArea: CauseArea) =>
          causeArea.organizations.map((o) => o.standardShare).join(","),
        )
        .join("|"),
    );
    state = {
      ...state,
      distributionCauseAreas: action.payload.result.map((causeArea: CauseArea) => ({
        id: causeArea.id,
        name: causeArea.name,
        percentageShare: "0",
        standardSplit: true,
        organizations: causeArea.organizations.map(
          (org): DistributionCauseAreaOrganization => ({
            id: org.id,
            percentageShare: org.standardShare?.toString() ?? "0",
          }),
        ),
      })),
    };
  }

  if (isType(action, registerDonationAction.done)) {
    state = {
      ...state,
      kid: action.payload.result.KID,
      paymentProviderURL: action.payload.result.paymentProviderUrl,
      swishOrderID: action.payload.result.swishOrderID,
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
    case SET_CAUSE_AREA_PERCENTAGE_SHARE:
      state = {
        ...state,
        distributionCauseAreas: state.distributionCauseAreas.map((causeArea) => {
          if (causeArea.id === action.payload.causeAreaId) {
            return {
              ...causeArea,
              percentageShare: action.payload.percentageShare,
            };
          } else {
            return causeArea;
          }
        }),
      };
      break;
    case SUBMIT_PHONE_NUMBER:
      state = {
        ...state,
        phone: action.payload.phone,
      };
      break;
    case SET_SHARES:
      state = {
        ...state,
        distributionCauseAreas: state.distributionCauseAreas.map((causeArea) => {
          if (causeArea.id === action.payload.causeAreaId) {
            return {
              ...causeArea,
              organizations: action.payload.shares,
            };
          } else {
            return causeArea;
          }
        }),
      };
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
      state = {
        ...state,
        distributionCauseAreas: state.distributionCauseAreas.map((causeArea) => {
          if (causeArea.id === action.payload.causeAreaId) {
            return {
              ...causeArea,
              standardSplit: action.payload.standardSplit,
            };
          }
          return causeArea;
        }),
      };
      break;
    case SELECT_CUSTOM_SHARE:
      state = {
        ...state,
        distributionCauseAreas: state.distributionCauseAreas.map((causeArea) => {
          if (causeArea.id === action.payload.causeAreaId) {
            return {
              ...causeArea,
              shareType: action.payload.customShare ? ShareType.CUSTOM : ShareType.STANDARD,
            };
          }
          return causeArea;
        }),
      };
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
  if (!validateDistributionCauseAreasShareSumToHundred(state.distributionCauseAreas)) {
    console.log(`Sum is not 100 for cause areas`);
    return { ...state, isValid: false };
  }
  if (!validateDistributionCauseAreasShareNotNegative(state.distributionCauseAreas)) {
    console.log(`Share is negative for cause areas`);
    return { ...state, isValid: false };
  }
  for (const causeArea of state.distributionCauseAreas) {
    if (!causeArea.standardSplit) {
      if (!validateDistributionCauseAreaOrgsShareSumToHundred(causeArea.organizations)) {
        console.log(`Sum is not 100 for orgs in cause area ${causeArea.id}`);
        return { ...state, isValid: false };
      }
      if (!validateDistributionCauseAreaOrgsShareNotNegative(causeArea.organizations)) {
        console.log(`Share is negative for orgs in cause area ${causeArea.id}`);
        return { ...state, isValid: false };
      }
    }
  }

  // Sum is checked for being an integer in DonorPane
  // If it is not an integer, sum is set to -1
  if (!state.sum || state.sum <= 0) {
    return { ...state, isValid: false };
  }

  return { ...state, isValid: true };
};

const validateDistributionCauseAreasShareSumToHundred = (
  distributionCauseAreas: DistributionCauseArea[],
): boolean => {
  const sum = distributionCauseAreas.reduce(
    (acc, causeArea) => acc + parseFloat(causeArea.percentageShare),
    0,
  );
  return sum === 100;
};

const validateDistributionCauseAreasShareNotNegative = (
  distributionCauseAreas: DistributionCauseArea[],
): boolean => {
  const negativeShare = distributionCauseAreas.some(
    (causeArea) => parseFloat(causeArea.percentageShare) < 0,
  );
  return !negativeShare;
};

const validateDistributionCauseAreaOrgsShareSumToHundred = (
  distributionCauseAreaOrgs: DistributionCauseAreaOrganization[],
): boolean => {
  const sum = distributionCauseAreaOrgs.reduce(
    (acc, org) => acc + parseFloat(org.percentageShare),
    0,
  );
  return sum === 100;
};

const validateDistributionCauseAreaOrgsShareNotNegative = (
  distributionCauseAreaOrgs: DistributionCauseAreaOrganization[],
): boolean => {
  const negativeShare = distributionCauseAreaOrgs.some(
    (org) => parseFloat(org.percentageShare) < 0,
  );
  return !negativeShare;
};

import { Reducer } from "redux";
import { isType } from "typescript-fsa";
import { getEarliestPossibleChargeDate } from "../../components/panes/PaymentPane/AvtaleGiro/AvtaleGiroDatePicker/avtalegirodates";
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
} from "./types";
import { CauseArea } from "../../types/CauseArea";
import { DistributionCauseArea } from "../../types/DistributionCauseArea";
import { DistributionCauseAreaOrganization } from "../../types/DistributionCauseAreaOrganization";
import { CauseAreaShareSelectionTitle } from "../../components/panes/DonationPane/ShareSelector/Multiple/MultipleCauseAreasSelector.style";

const initialState: Donation = {
  recurring: RecurringDonation.NON_RECURRING,
  donor: {
    taxDeduction: false,
    newsletter: false,
  },
  errors: [],
  showErrors: false,
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
    const topOrderedId = action.payload.result.sort((a, b) => a.ordering - b.ordering)[0].id;
    state = {
      ...state,
      distributionCauseAreas: action.payload.result.map((causeArea: CauseArea) => ({
        id: causeArea.id,
        name: causeArea.name,
        percentageShare: causeArea.id === topOrderedId ? "100" : "0",
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
      swishPaymentRequestToken: action.payload.result.swishPaymentRequestToken,
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
  const errors: typeof state.errors = [];

  const causeAreasDistributionSum = getCauseAreasDistributionSum(state.distributionCauseAreas);
  if (causeAreasDistributionSum !== 100) {
    errors.push({
      type: "causeAreaSumError",
      variables: { sum: causeAreasDistributionSum.toString() },
    });
  }
  if (getDistributionCauseAreasShareNegative(state.distributionCauseAreas)) {
    errors.push({ type: "causeAreaShareNegativeError" });
  }
  for (const causeArea of state.distributionCauseAreas) {
    if (!causeArea.standardSplit) {
      const causeAreaOrgsDistributionSum = getDistributionCauseAreaOrgsShareSum(
        causeArea.organizations,
      );
      if (causeAreaOrgsDistributionSum !== 100) {
        errors.push({
          type: "causeAreaOrganizationsSumError",
          causeAreaId: causeArea.id,
          variables: {
            sum: causeAreaOrgsDistributionSum.toString(),
            causeAreaName: causeArea.name,
          },
        });
      }
      if (getDistributionCauseAreaOrgsShareNegative(causeArea.organizations)) {
        errors.push({
          type: "causeAreaOrganizationsShareNegativeError",
          causeAreaId: causeArea.id,
          variables: { causeAreaName: causeArea.name },
        });
      }
    }
  }

  // Sum is checked for being an integer in DonorPane
  // If it is not an integer, sum is set to -1
  if (!state.sum || state.sum <= 0) {
    errors.push({ type: "donationSumError" });
  }

  if (errors.length > 0) {
    return { ...state, errors };
  }

  return { ...state, errors: [] };
};

const getCauseAreasDistributionSum = (distributionCauseAreas: DistributionCauseArea[]): number => {
  const sum = distributionCauseAreas.reduce(
    (acc, causeArea) => acc + cleanNaN(causeArea.percentageShare),
    0,
  );
  return sum;
};

const getDistributionCauseAreasShareNegative = (
  distributionCauseAreas: DistributionCauseArea[],
): boolean => {
  const negativeShare = distributionCauseAreas.some(
    (causeArea) => parseFloat(causeArea.percentageShare) < 0,
  );
  return negativeShare;
};

const getDistributionCauseAreaOrgsShareSum = (
  distributionCauseAreaOrgs: DistributionCauseAreaOrganization[],
): number => {
  const sum = distributionCauseAreaOrgs.reduce(
    (acc, org) => acc + cleanNaN(org.percentageShare),
    0,
  );
  return sum;
};

const getDistributionCauseAreaOrgsShareNegative = (
  distributionCauseAreaOrgs: DistributionCauseAreaOrganization[],
): boolean => {
  const negativeShare = distributionCauseAreaOrgs.some(
    (org) => parseFloat(org.percentageShare) < 0,
  );
  return negativeShare;
};

const cleanNaN = (number: string): number => (isNaN(parseFloat(number)) ? 0 : parseFloat(number));

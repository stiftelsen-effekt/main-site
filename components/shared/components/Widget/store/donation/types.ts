import { DistributionCauseAreaOrganization } from "../../types/DistributionCauseAreaOrganization";
import { PaymentMethod, RecurringDonation, ShareType } from "../../types/Enums";
import { OrganizationShare } from "../../types/Temp";
import { VippsAgreement } from "../state";

export const SELECT_PAYMENT_METHOD = "SELECT_PAYMENT_METHOD";
export const SELECT_TAX_DEDUCTION = "SELECT_TAX_DEDUCTION";
export const SUBMIT_DONOR_INFO = "SUBMIT_DONOR_INFO";
export const SET_CAUSE_AREA_PERCENTAGE_SHARE = "SET_CAUSE_AREA_PERCENTAGE_SHARE";
export const SET_SHARES = "SET_SHARES";
export const SET_SUM = "SET_SUM";
export const SET_DUE_DAY = "SET_DUE_DAY";
export const SET_RECURRING = "SET_RECURRING";
export const SET_KID = "SET_KID";
export const SET_DONOR_ID = "SET_DONOR_ID";
export const SET_PAYMENT_PROVIDER_URL = "SET_PAYMENT_PROVIDER_URL";
export const SELECT_CUSTOM_SHARE = "SELECT_CUSTOM_SHARE";
export const SET_SHARE_TYPE = "SET_SHARE_TYPE";
export const SET_VIPPS_AGREEMENT = "SET_VIPPS_AGREEMENT";
export const SET_CAUSE_AREA_SELECTION = "SET_CAUSE_AREA_SELECTION";
export const SET_CAUSE_AREA_AMOUNT = "SET_CAUSE_AREA_AMOUNT";
export const SET_CAUSE_AREA_DISTRIBUTION_TYPE = "SET_CAUSE_AREA_DISTRIBUTION_TYPE";
export const SET_ORG_AMOUNT = "SET_ORG_AMOUNT";
export const SET_SMART_DISTRIBUTION_TOTAL = "SET_SMART_DISTRIBUTION_TOTAL";
export const SET_GLOBAL_OPERATIONS_ENABLED = "SET_GLOBAL_OPERATIONS_ENABLED";
export const SET_GLOBAL_OPERATIONS_PERCENTAGE_MODE = "SET_GLOBAL_OPERATIONS_PERCENTAGE_MODE";
export const SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA =
  "SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA";
export const SET_GLOBAL_OPERATIONS_PERCENTAGE = "SET_GLOBAL_OPERATIONS_PERCENTAGE";
export const SET_OPERATIONS_PERCENTAGE_BY_CAUSE_AREA = "SET_OPERATIONS_PERCENTAGE_BY_CAUSE_AREA";
export const SET_OPERATIONS_CONFIG = "SET_OPERATIONS_CONFIG";

interface SelectPaymentMethod {
  type: typeof SELECT_PAYMENT_METHOD;
  payload: {
    method: PaymentMethod;
  };
}

interface SelectTaxDeduction {
  type: typeof SELECT_TAX_DEDUCTION;
  payload: {
    taxDeduction: boolean;
  };
}

interface SubmitDonorInfo {
  type: typeof SUBMIT_DONOR_INFO;
  payload: {
    name: string;
    email: string;
    taxDeduction: boolean;
    ssn: string;
    newsletter: boolean;
  };
}

interface SetCauseAreaPercentageShare {
  type: typeof SET_CAUSE_AREA_PERCENTAGE_SHARE;
  payload: {
    causeAreaId: number;
    percentageShare: string;
  };
}

interface SetShares {
  type: typeof SET_SHARES;
  payload: {
    causeAreaId: number;
    shares: DistributionCauseAreaOrganization[];
  };
}

interface SetSum {
  type: typeof SET_SUM;
  payload: {
    sum: number;
  };
}

interface SetDueDay {
  type: typeof SET_DUE_DAY;
  payload: {
    day: number;
  };
}

interface SetRecurring {
  type: typeof SET_RECURRING;
  payload: {
    recurring: RecurringDonation;
  };
}

interface SetKID {
  type: typeof SET_KID;
  payload: {
    kid: string;
  };
}

interface SetDonorID {
  type: typeof SET_DONOR_ID;
  payload: {
    donorID: number;
  };
}

interface SetPaymentProviderURL {
  type: typeof SET_PAYMENT_PROVIDER_URL;
  payload: {
    url: string;
  };
}

interface SelectCustomShare {
  type: typeof SELECT_CUSTOM_SHARE;
  payload: {
    causeAreaId: number;
    customShare: boolean;
  };
}

interface SetShareType {
  type: typeof SET_SHARE_TYPE;
  payload: {
    causeAreaId: number;
    standardSplit: boolean;
  };
}

interface SetVippsAgreement {
  type: typeof SET_VIPPS_AGREEMENT;
  payload: {
    vippsAgreement: VippsAgreement;
  };
}
interface SetCauseAreaSelection {
  type: typeof SET_CAUSE_AREA_SELECTION;
  payload: {
    /** 'single' = one cause area, 'multiple' = all cause areas */
    selectionType: "single" | "multiple";
    /** when selectionType is 'single', the selected cause area ID */
    causeAreaId?: number;
  };
}
interface SetCauseAreaAmount {
  type: typeof SET_CAUSE_AREA_AMOUNT;
  payload: {
    /** cause area ID for which amount is set */
    causeAreaId: number;
    /** amount in NOK */
    amount: number;
  };
}
interface SetCauseAreaDistributionType {
  type: typeof SET_CAUSE_AREA_DISTRIBUTION_TYPE;
  payload: {
    /** cause area ID for which distribution type is set */
    causeAreaId: number;
    /** distribution type */
    distributionType: ShareType;
  };
}
interface SetOrgAmount {
  type: typeof SET_ORG_AMOUNT;
  payload: {
    /** organization ID for which amount is set */
    orgId: number;
    /** amount in NOK */
    amount: number;
  };
}

interface SetSmartDistributionTotal {
  type: typeof SET_SMART_DISTRIBUTION_TOTAL;
  payload: {
    /** total amount in NOK for smart distribution */
    smartDistributionTotal: number;
  };
}

interface SetGlobalOperationsEnabled {
  type: typeof SET_GLOBAL_OPERATIONS_ENABLED;
  payload: {
    /** whether global operations cut is enabled (for multiple cause areas) */
    enabled: boolean;
  };
}

interface SetGlobalOperationsPercentageMode {
  type: typeof SET_GLOBAL_OPERATIONS_PERCENTAGE_MODE;
  payload: {
    /** whether to use percentage mode (true) or custom amount mode (false) */
    isPercentageMode: boolean;
  };
}

interface SetOperationsPercentageModeByCauseArea {
  type: typeof SET_OPERATIONS_PERCENTAGE_MODE_BY_CAUSE_AREA;
  payload: {
    /** cause area ID */
    causeAreaId: number;
    /** whether to use percentage mode (true) or custom amount mode (false) */
    isPercentageMode: boolean;
  };
}

interface SetGlobalOperationsPercentage {
  type: typeof SET_GLOBAL_OPERATIONS_PERCENTAGE;
  payload: {
    /** percentage value (0-100) */
    percentage: number;
  };
}

interface SetOperationsPercentageByCauseArea {
  type: typeof SET_OPERATIONS_PERCENTAGE_BY_CAUSE_AREA;
  payload: {
    /** cause area ID */
    causeAreaId: number;
    /** percentage value (0-100) */
    percentage: number;
  };
}

interface SetOperationsConfig {
  type: typeof SET_OPERATIONS_CONFIG;
  payload: {
    defaultPercentage: number;
    enabledByDefaultGlobal: boolean;
    enabledByDefaultSingle: boolean;
    excludedCauseAreaIds: number[];
  };
}

export type DonationActionTypes =
  | SelectPaymentMethod
  | SelectTaxDeduction
  | SubmitDonorInfo
  | SetCauseAreaPercentageShare
  | SetShares
  | SetSum
  | SetDueDay
  | SetRecurring
  | SetKID
  | SetDonorID
  | SetPaymentProviderURL
  | SelectCustomShare
  | SetShareType
  | SetVippsAgreement
  | SetCauseAreaSelection
  | SetCauseAreaAmount
  | SetCauseAreaDistributionType
  | SetOrgAmount
  | SetSmartDistributionTotal
  | SetGlobalOperationsEnabled
  | SetGlobalOperationsPercentageMode
  | SetOperationsPercentageModeByCauseArea
  | SetGlobalOperationsPercentage
  | SetOperationsPercentageByCauseArea
  | SetOperationsConfig;

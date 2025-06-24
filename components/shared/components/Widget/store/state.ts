import { CauseArea } from "../types/CauseArea";
import { DistributionCauseArea } from "../types/DistributionCauseArea";
import { PaymentMethod, RecurringDonation, ShareType } from "../types/Enums";
import { Organization } from "../types/Organization";
import { OrganizationShare, ReferralType } from "../types/Temp";

export interface State {
  donation: Donation;
  layout: Layout;
  referrals: Referrals;
  error: Error;
}

export interface Layout {
  paneNumber: number;
  answeredReferral?: boolean;
  height: number;
  loading: boolean;
  causeAreas?: CauseArea[];
}

export interface DonationInput {
  method?: PaymentMethod;
  recurring: RecurringDonation;
  donor: Donor;
  dueDay: number;
  vippsAgreement: VippsAgreement;
}

export interface Donation extends DonationInput {
  kid?: string;
  paymentProviderURL?: string;
  swishOrderID?: string;
  swishPaymentRequestToken?: string;
  // Array of objects with string keys and string values
  errors: DonationError[];
  showErrors: boolean;
  /** UI selection: 'single' = one cause area, 'multiple' = all cause areas */
  selectionType?: "single" | "multiple";
  /** When selectionType is 'single', the selected cause area ID */
  selectedCauseAreaId?: number;
  /** UI-entered amounts per cause area (NOK) */
  causeAreaAmounts?: Record<number, number>;
  /** UI-selected wether a cause area is standard split */
  causeAreaDistributionType?: Record<number, ShareType>;
  /** UI-entered amounts per organization (NOK), keyed by organization ID */
  orgAmounts?: Record<number, number>;
  /** Smart distribution total amount (NOK) - when selectedCauseAreaId === -1 */
  smartDistributionTotal?: number;
  /** Whether global operations cut is enabled (for multiple cause areas) */
  globalOperationsEnabled?: boolean;
  /** Whether global operations cut is in percentage mode (true) or custom amount mode (false) */
  globalOperationsPercentageMode?: boolean;
  /** Whether operations cut is in percentage mode (true) or custom amount mode (false) for each cause area */
  operationsPercentageModeByCauseArea?: Record<number, boolean>;
  /** Global operations percentage value (0-100) */
  globalOperationsPercentage?: number;
  /** Operations percentage values by cause area (0-100) */
  operationsPercentageByCauseArea?: Record<number, number>;
}

export type DonationError = {
  type: DonationErrorTypeNames;
  causeAreaId?: number;
  variables?: { [key: string]: string };
};
export type DonationErrorTypeNames =
  | "causeAreaSumError"
  | "causeAreaOrganizationsSumError"
  | "causeAreaShareNegativeError"
  | "causeAreaOrganizationsShareNegativeError"
  | "donationSumError";

export interface VippsAgreement {
  initialCharge: boolean;
  monthlyChargeDay: number;
}

export interface RegisterDonationObject {
  donor: Donor;
  method: PaymentMethod;
  recurring: RecurringDonation;
  amount: number;
  dueDay?: number;
}

export interface DonorInput {
  name?: string;
  email?: string;
  taxDeduction: boolean;
  ssn?: string;
  newsletter: boolean;
  dueDay?: number;
}

export interface Donor extends DonorInput {
  donorID?: number;
}

export interface Referrals {
  referrals?: [ReferralType];
  selectedReferrals: number[];
  otherText: string;
  websiteSession: string;
}

export interface DonorFormValues extends DonorInput {
  privacyPolicy: boolean;
}

export interface Share {
  organizationID: number;
  share: number;
}

export interface Error {
  isVisible: boolean;
  message: string;
}

export enum PaneNumber {
  MethodPane = 0,
  DonorPane = 1,
  DonationPane = 2,
  ReferralPane = 3,
  ResultPane = 4,
}

export type CauseAreaOrgs = {
  name: string;
  organizations: Organization[];
};

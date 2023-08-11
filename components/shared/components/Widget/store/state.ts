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
  sum?: number;
  recurring: RecurringDonation;
  donor: Donor;
  distributionCauseAreas: DistributionCauseArea[];
  dueDay: number;
  vippsAgreement: VippsAgreement;
  phone?: string;
}

export interface Donation extends DonationInput {
  kid?: string;
  paymentProviderURL?: string;
  swishOrderID?: string;
  isValid: boolean;
}

export interface VippsAgreement {
  initialCharge: boolean;
  monthlyChargeDay: number;
}

export interface RegisterDonationObject {
  donor: Donor;
  method: PaymentMethod;
  recurring: RecurringDonation;
  amount: number;
  distributionCauseAreas: DistributionCauseArea[];
  dueDay?: number;
  phone?: string;
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

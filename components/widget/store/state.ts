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
  privacyPolicy: boolean;
  paneNumber: number;
  answeredReferral?: boolean;
  height: number;
  loading: boolean;
  organizations?: Organization[];
}

export interface DonationInput {
  method?: PaymentMethod;
  sum?: number;
  shareType: ShareType;
  recurring: RecurringDonation;
  donor?: Donor;
  shares: OrganizationShare[];
  dueDay: number;
  vippsAgreement: VippsAgreement;
}

export interface Donation extends DonationInput {
  kid?: string;
  paymentProviderURL?: string;
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
  organizations?: OrganizationShare[];
  dueDay?: number;
}

export interface DonorInput {
  name?: string;
  email?: string;
  taxDeduction?: boolean;
  ssn?: string;
  newsletter?: boolean;
  dueDay?: number;
}

export interface Donor extends DonorInput {
  donorID?: number;
}

export interface Referrals {
  referrals?: [ReferralType];
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

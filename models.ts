import { SanityAsset } from "@sanity/image-url/lib/types/types";

export enum META_OWNER {
  EFFEKT = 1,
  EAN = 2,
  EFFEKTANDEAN = 3,
}

export type Donation = {
  KID: string;
  donor: string;
  donorId: number;
  email: string;
  id: number;
  paymentMethod: string;
  sum: string;
  timestamp: string;
  transactionCost: string;
  metaOwnerId: META_OWNER;
};

export type AvtaleGiroAgreement = {
  ID: number;
  active: number;
  amount: string;
  KID: string;
  payment_date: number;
  created: string;
  last_updated: string;
  notice: boolean;
  full_name: string;
  cancelled: string;
};

export type VippsAgreement = {
  ID: number;
  status: "EXPIRED" | "PENDING" | "ACTIVE" | "STOPPED";
  donorID: number;
  full_name: string;
  KID: string;
  timestamp_created: string;
  monthly_charge_day: number;
  force_charge_date: boolean;
  paused_until_date: string;
  amount: number;
  agreement_url_code: string;
};

export type Distribution = {
  kid: string;
  organizations: {
    id: number;
    name: string;
    share: string;
  }[];
};

export type Donor = {
  id: string;
  name: string;
  email: string;
  newsletter: boolean;
  registered: string;
};

export type AggregatedDonations = {
  abbriv: string;
  organization: string;
  organizationId: number;
  value: string;
  year: number;
};

export type DonationGraphData = {
  name: string;
};

export type Organization = {
  id: number;
  name: string;
  abbriv: string;
  shortDesc: string;
  standardShare: number;
  infoUrl: string;
};

export type SEOMeta = {
  title: string;
  titleTemplate?: string;
  description: string;
  imageAsset: SanityAsset;
  canonicalurl: string;
};

export type FacebookDonationRegistration = {
  email: string;
  paymentID: string;
  name: string;
  ssn: string;
};

export type TaxUnit = {
  id: number;
  donorId: number;
  ssn: string;
  name: string;
  numDonations: number;
  sumDonations: number;
  registered: string;
  archived: string | null;
  taxDeductions?: { year: number; sumDonations: number; taxDeduction: number }[];
};

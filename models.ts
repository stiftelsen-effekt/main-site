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
  standardDistribution: boolean;
  taxUnit: TaxUnit | null;
  shares: {
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

export type TaxYearlyReport = {
  year: number;
  units: TaxYearlyReportUnits[];
  sumDonationsWithoutTaxUnitByChannel: TaxYearlyReportMissingTaxUnitDonations[];
  sumTaxDeductionsByChannel: TaxYearlyReportChannelDeductions[];
  sumNonDeductibleDonationsByType: TaxYearlyReportNonDeductibleDonations[];
  sumTaxDeductions: number;
};

export type TaxYearlyReportMissingTaxUnitDonations = {
  channel: "Gi Effektivt" | "EAN Giverpotal";
  sumDonationsWithoutTaxUnit: number;
};

export type TaxYearlyReportChannelDeductions = {
  channel: "Gi Effektivt" | "EAN Giverpotal";
  sumTaxDeductions: number;
};

export type TaxYearlyReportNonDeductibleDonations = {
  type: "Crypto" | "Stiftelsen Gi Effektivt";
  sumNonDeductibleDonations: number;
};

export type TaxYearlyReportUnits = {
  id: number;
  name: string;
  ssn: string;
  sumDonations: number;
  taxDeduction: number;
  channel: "Gi Effektivt" | "EAN Giverpotal";
};

export type ImpactCharity = {
  id: number; // Not necessarily the same as the id in the database
  charity_name: string;
  abbreviation: string;
};

export type ImpactIntervention = {
  long_description: string;
  short_description: string;
  id: number;
};

export type ImpactEvaluation = {
  id: number;
  intervention: ImpactIntervention;
  converted_cost_per_output: number;
  currency: string;
  language: string;
  start_year: number;
  start_month: number;
  cents_per_output: number;
  charity: ImpactCharity;
};

export type GiveWellGrant = {
  id: number;
  allotment_set: {
    id: number;
    intervention: ImpactIntervention;
    converted_sum: number;
    currency: string;
    converted_cost_per_output: number;
    exchange_rate_date: string;
    sum_in_cents: number;
    number_outputs_purchased: number;
    charity: ImpactCharity;
  }[];
  language: string;
  start_year: number;
  start_month: number;
};

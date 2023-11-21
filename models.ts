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
  donorId: number;
  taxUnitId: number;
  causeAreas: DistributionCauseArea[];
};

export type DistributionCauseArea = {
  id: number;
  standardSplit: boolean;
  percentageShare: string;
  organizations: {
    id: number;
    name?: string;
    percentageShare: string;
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
  /** @description The year the report is for */
  year: number;
  /** @description The tax units for the year */
  units: TaxYearlyReportUnits[];
  /** @description The sum of all donations for the year not connected to a tax unit */
  sumDonationsWithoutTaxUnit: {
    /** @description The sum of all donations for the year not connected to a tax unit */
    sumDonations: number;
    /** @description The channels for the year */
    channels: {
      /** @description The channel (or entity the donations where given to) for the year and channel */
      channel: string;
      /** @description The sum of all donations for the year and channel */
      sumDonations: number;
    }[];
  };
  /** @description The sum of all non deductible donations for the year and type */
  sumNonDeductibleDonationsByType: {
    /** @description The type of non deductible donation */
    type: string;
    /** @description The sum of all non deductible donations for the year and type */
    sumNonDeductibleDonations: number;
  }[];
  /** @description The sum of all tax deductions for the year */
  sumTaxDeductions: number;
  /** @description The sum of all donations for the year */
  sumDonations: number;
};

export type TaxYearlyReportUnits = {
  /** @description The Auto-generated id for a tax unit */
  id: number;
  /** @description Full name of the tax unit (either a personal name or a business entity) */
  name: string;
  /** @description Either a personal number or the number for the business entity */
  ssn: string;
  /** @description The sum of all donations for the tax unit for the year and channel */
  sumDonations: number;
  /** @description The tax deduction for the tax unit for the year and channel */
  taxDeduction: number;
  /** @description The channels for the tax unit for the year */
  channels: {
    /** @description The channel (or entity the donations where given to) for the tax unit for the year and channel */
    channel: string;
    /** @description The sum of all donations for the tax unit for the year and channel */
    sumDonations: number;
  }[];
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

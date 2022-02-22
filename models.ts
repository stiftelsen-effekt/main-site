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
};

export type Donor = {
  id: string;
  name: string;
  email: string;
  ssn: string;
  newsletter: boolean;
};

export type AggregatedDonations = {
  abbriv: string;
  organization: string;
  organizationId: number;
  value: string;
  year: number;
}

export type DonationGraphData = {
  name: string
}
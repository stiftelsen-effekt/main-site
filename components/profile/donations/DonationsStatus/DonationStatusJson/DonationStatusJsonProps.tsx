import { DonationDetailsConfiguration } from "../../../shared/lists/donationList/DonationDetails";

export interface Charity {
  id: number;
  name: string;
  date?: string;
  share: number;
  charityInfo: string;
}

export interface Provider {
  receivedDate?: string;
  provider: string;
  amount: number;
  involvedCharities: Charity[];
}

export interface jsonObject {
  direct: Provider[];
  smart: Provider[];
  giEffektivt: Provider;
}

export interface TimelineProps {
  configuration: DonationDetailsConfiguration;
  description: string;
  data: jsonObject;
}

import { DonationDetailsConfiguration } from "../../../shared/lists/donationList/DonationDetails";

export interface Charity {
  id: number;
  name: string;
  date?: string;
  share: number;
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
}

export interface TimelineProps {
  configuration: DonationDetailsConfiguration;
  description: string;
  data: jsonObject;
}

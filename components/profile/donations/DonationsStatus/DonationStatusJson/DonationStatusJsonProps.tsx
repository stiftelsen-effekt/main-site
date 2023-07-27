import { TestModal } from "../../../../shared/components/Timeline/DonationsTimeline";
import { DonationDetailsConfiguration } from "../../../shared/lists/donationList/DonationDetails";

export interface Charity {
  id: number;
  name: string;
  date?: string;
  share: number;
}

export interface Provider {
  provider: string;
  amount: number;
  involvedCharities: Charity[];
}

export interface jsonObject {
  direct: Provider[];
  smart: Provider[];
}

export interface TimelineProps {
  description: string;
  data: jsonObject;
  configuration: DonationDetailsConfiguration;
}

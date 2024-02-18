import { DistributionCauseAreaOrganization } from "./DistributionCauseAreaOrganization";

export type DistributionCauseArea = {
  /** @description The cause area id */
  id: number;
  name: string;
  /** @description Whether the distribution is a standard distribution */
  standardSplit: boolean;
  /** @description The percentage share for the given cause area in decimal form */
  percentageShare: string;
  organizations: DistributionCauseAreaOrganization[];
};

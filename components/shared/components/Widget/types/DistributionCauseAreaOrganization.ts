export type DistributionCauseAreaOrganization = {
  /** @description The organization id */
  id: number;
  /** @description The organization name */
  name?: string;
  informationUrl?: string;
  /** @description The percentage share for the given organizations in decimal form */
  percentageShare: string;
};

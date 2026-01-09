export type DistributionCauseAreaOrganization = {
  /** @description The organization id */
  id: string;
  /** @description The organization name */
  name?: string;
  informationUrl?: string;
  /** @description The percentage share for the given organizations in decimal form */
  percentageShare: string;
  /** @description The prefilled percentage share for the given organizations in decimal
   * form */
  prefilledPercentageShare?: string;
};

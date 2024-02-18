import { Organization } from "./Organization";

export type CauseArea = {
  /** @description The cause area id */
  id: number;
  /** @description The cause area name */
  name: string;
  /** @description The cause area short description */
  shortDescription: string;
  /** @description The cause area long description */
  longDescription: string;
  /** @description The cause area information url */
  informationUrl: string;
  /** @description Whether the cause area is active */
  isActive: boolean;
  /** @description The cause area ordering */
  ordering: number;
  /** @description The cause area organizations */
  organizations: Organization[];
};

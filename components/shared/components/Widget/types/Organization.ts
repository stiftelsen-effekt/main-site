export interface Organization {
  /** @description The organization id */
  id: number;
  /** @description The cause area id the organization belongs to */
  causeAreaId: number;
  /** @description The standard share within the cause area */
  standardShare?: number;
  /** @description The organization name */
  name: string;
  /** @description The organization abbreviation */
  abbreviation?: string;
  /** @description The organization short description */
  shortDescription?: string;
  /** @description The organization long description */
  longDescription?: string;
  /** @description The organization information url */
  informationUrl?: string;
  /** @description Whether the organization is active or not */
  isActive: boolean;
  /** @description The ordering of the organization within the cause area (used for sorting frontend) */
  ordering: number;
}

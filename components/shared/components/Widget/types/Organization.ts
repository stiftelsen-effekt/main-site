export interface Organization {
  /** @description The organization id */
  id: string;
  /** @description The cause area id the organization belongs to */
  causeAreaId: string;
  /** @description The standard share within the cause area */
  standardShare?: number;
  /** @description The organization name */
  name: string;
  widgetDisplayName?: string;
  widgetContext?: string;
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

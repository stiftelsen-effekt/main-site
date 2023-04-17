import { pages, types } from "./schemas/schema";

type SanityField = {
  name: string;
  type: string;
};

type SanityDocument = {
  name: string;
  type: string;
  fields: Readonly<SanityField[]>;
};

type SanityModel<T extends Readonly<SanityDocument>> = {
  [L in T["fields"][number]["name"]]: any;
};

type SanityModels<T extends Readonly<SanityDocument[]>> = {
  [K in T[number]["name"]]: Readonly<SanityModel<T[number]>>;
};

export type PageTypes = SanityModels<typeof pages>;
export type ContentTypes = SanityModels<typeof types>;

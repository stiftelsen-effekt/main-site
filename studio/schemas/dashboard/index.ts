import { isShallowSlug } from "../../validators/isShallowSlug";
import agreements from "./agreements";
import donations from "./donations";
import metareceipt from "./metareceipt";
import profile from "./profile";
import taxdeduction from "./taxdeduction";
import taxstatements from "./taxstatements";
import taxunits from "./taxunits";

const dashboard = {
  name: "dashboard",
  title: "Dashboard",
  type: "document",
  fields: [
    {
      name: "dashboard_slug",
      title: "Dashboard slug",
      type: "slug",
      initialValue: "my-pages",
      description:
        "Entry point for dashboard. Please note that this must be an allowed redirect URI in Auth0.",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
    {
      name: "tax_slug",
      title: "Tax slug",
      type: "slug",
      initialValue: "taxes",
      description: "Relative to dashboard",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
  ],
  preview: {
    select: {
      title: "dashboard_slug.current",
    },
  },
} as const;

export default [
  dashboard,
  agreements,
  donations,
  profile,
  taxdeduction,
  taxunits,
  taxstatements,
  metareceipt,
];

import { isShallowSlug } from "../validators/isShallowSlug";

export default {
  name: "dashboard",
  title: "Dashboard",
  type: "document",
  fields: [
    {
      name: "main_navigation",
      title: "Menu",
      type: "array",
      of: [{ type: "navitem" }, { type: "navgroup" }],
    },
    {
      name: "dashboard_slug",
      title: "Dashboard slug",
      type: "slug",
      initialValue: "my-pages",
      description:
        "Entry point for dashboard. Please note that this must be an allowed redirect URI in Auth0.",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
  ],
  preview: {
    select: {
      title: "dashboard_slug.current",
    },
  },
} as const;

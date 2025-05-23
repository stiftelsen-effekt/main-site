export default {
  title: "Results page",
  name: "results",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "pageheader",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "resultssection",
        },
      ],
    },
    {
      name: "textConfiguration",
      title: "Text Configuration",
      type: "resultstext",
      description: "Configure all the text used on the results page",
    },
    {
      name: "outputMappings",
      title: "Output Type Mappings",
      type: "array",
      of: [{ type: "outputmapping" }],
      description: "Map Sanity output types to API data keys",
    },
    {
      name: "organizationMappings",
      title: "Organization Mappings",
      type: "array",
      of: [{ type: "organizationmapping" }],
      description: "Map organization abbreviations to full names",
    },
    {
      name: "referralTypeMappings",
      title: "Referral Type Mappings",
      type: "array",
      of: [{ type: "referraltypemapping" }],
      description: "Map referral type API keys to display labels",
    },
    {
      title: "Sitemap priority",
      name: "sitemap_priority",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0).max(1),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
} as const;

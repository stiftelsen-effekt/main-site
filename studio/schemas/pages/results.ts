import { defineType, defineField } from "sanity";

export default defineType({
  title: "Results page",
  name: "results",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageheader",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "resultssection",
        },
      ],
    }),
    defineField({
      name: "textConfiguration",
      title: "Text Configuration",
      type: "resultstext",
      description: "Configure all the text used on the results page",
    }),
    defineField({
      name: "outputMappings",
      title: "Output Type Mappings",
      type: "array",
      of: [{ type: "outputmapping" }],
      description: "Map Sanity output types to API data keys",
    }),
    defineField({
      name: "organizationMappings",
      title: "Organization Mappings",
      type: "array",
      of: [{ type: "organizationmapping" }],
      description: "Map organization abbreviations to full names",
    }),
    defineField({
      name: "referralTypeMappings",
      title: "Referral Type Mappings",
      type: "array",
      of: [{ type: "referraltypemapping" }],
      description: "Map referral type API keys to display labels",
    }),
    defineField({
      title: "Sitemap priority",
      name: "sitemap_priority",
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
});

import { defineType, defineField } from "sanity";

export default defineType({
  name: "aggregateestimatedimpact",
  type: "document",
  title: "Aggregate estimated impact",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "org_grant_template_string",
      title: "Org Grant Template String",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Use {{org}} to insert the organization name",
    }),
    defineField({
      name: "org_direct_template_string",
      title: "Org Direct Template String",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Use {{org}} to insert the organization name",
    }),
  ],
});

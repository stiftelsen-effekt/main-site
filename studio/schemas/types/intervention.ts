import { defineType, defineField } from "sanity";

export default defineType({
  name: "intervention",
  type: "object",
  title: "Intervention",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "organization_name",
      type: "string",
      title: "Organization name",
    }),
    defineField({
      name: "abbreviation",
      type: "string",
      title: "Abbreviation",
    }),
    defineField({
      name: "template_string",
      type: "text",
      rows: 2,
      title: "Template string",
    }),
    defineField({
      name: "organization_id",
      type: "string",
      title: "Organization ID",
    }),
    defineField({
      name: "cause_area_id",
      type: "string",
      title: "Cause area ID",
    }),
  ],
});

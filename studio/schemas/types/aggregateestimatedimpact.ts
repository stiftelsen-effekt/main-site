export default {
  name: "aggregateestimatedimpact",
  type: "document",
  title: "Aggregate estimated impact",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "org_grant_template_string",
      title: "Org Grant Template String",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "Use {{org}} to insert the organization name",
    },
    {
      name: "org_direct_template_string",
      title: "Org Direct Template String",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "Use {{org}} to insert the organization name",
    },
  ],
};

export default {
  name: "intervention",
  type: "object",
  title: "Intervention",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "organization_name",
      type: "string",
      title: "Organization name",
    },
    {
      name: "abbreviation",
      type: "string",
      title: "Abbreviation",
    },
    {
      name: "template_string",
      type: "text",
      rows: 2,
      title: "Template string",
    },
  ],
};

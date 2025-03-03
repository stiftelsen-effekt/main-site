export default {
  name: "intervention",
  type: "object",
  title: "Intervention",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The title for the buttons that will be shown in the widget, defaults to the organizations intervention type",
    },
    {
      name: "organization",
      type: "reference",
      to: [{ type: "organization" }],
      title: "Organization",
    },
    {
      name: "template_string",
      type: "text",
      rows: 2,
      title: "Template string",
    },
    {
      name: "template_donate_button",
      type: "string",
      title: "Template donate button",
      description:
        "The template string for the donate button. Use {outputs} to insert the number of outputs",
    },
  ],
} as const;

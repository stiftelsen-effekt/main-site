export default {
  name: "interventionwidget",
  type: "object",
  title: "Intervention widget",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "default_sum",
      type: "number",
      title: "Default sum",
    },
    {
      name: "interventions",
      type: "array",
      of: [{ type: "intervention" }],
    },
    {
      name: "button_text",
      type: "string",
      title: "Button text",
    },
  ],
} as const;

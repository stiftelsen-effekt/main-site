export default {
  type: "object",
  name: "graphcontext",
  fields: [
    {
      type: "string",
      name: "description",
      title: "Description",
      description: "A short description of the graph with main source if applicable",
    },
    {
      type: "string",
      name: "detailed_description_label",
      title: "Detailed description label",
      description: "The label for the detailed description expander",
    },
    {
      type: "array",
      name: "detailed_description",
      title: "Detailed description",
      of: [{ type: "block" }],
    },
    {
      type: "boolean",
      name: "allow_table",
      title: "Allow table view of data",
    },
    {
      type: "string",
      name: "table_label",
      title: "Table label",
      description: "The label for the table expander",
    },
    {
      type: "string",
      name: "table_close_label",
      title: "Table close label",
      description: "The label for the table close label",
    },
  ],
  initialValue: {
    allow_table: true,
    detailed_description_label: "Se detaljert beskrivelse av grafen",
    table_label: "Se data som tabell",
    table_close_label: "Skjul tabell",
  },
};

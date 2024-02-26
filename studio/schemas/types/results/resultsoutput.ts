export default {
  type: "object",
  name: "resultsoutput",
  fields: [
    {
      type: "string",
      name: "outputType",
      title: "Output Type",
      options: {
        list: [
          "Bednets",
          "Deworming",
          "Cash",
          "Cash zakat",
          "Vitamin A",
          "Malaria treatment",
          "Vaccinations",
          "Years of food fortification",
        ],
      },
    },
    {
      type: "array",
      name: "description",
      title: "Description",
      of: [{ type: "block" }],
    },
    {
      type: "graphcontext",
      name: "graphcontext",
      title: "Graph Context",
    },
  ],
};

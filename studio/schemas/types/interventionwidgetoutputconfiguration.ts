import { select } from "d3";

export default {
  type: "document",
  name: "interventionwidgetoutputconfiguration",
  title: "Intervention output Configuration",
  fields: [
    {
      name: "interventions",
      type: "array",
      of: [{ type: "intervention" }],
    },
    {
      name: "explanation_label",
      type: "string",
      title: "Explanation label",
    },
    {
      name: "explanation_text",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "explanation_links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
  preview: {
    select: {
      intervention1: "interventions[0].title",
      intervention2: "interventions[1].title",
      intervention3: "interventions[2].title",
      intervention4: "interventions[3].title",
      intervention5: "interventions[4].title",
    },
    prepare: ({
      intervention1,
      intervention2,
      intervention3,
      intervention4,
      intervention5,
    }: {
      intervention1: string;
      intervention2: string;
      intervention3: string;
      intervention4: string;
      intervention5: string;
    }) => {
      const interventions = [
        intervention1,
        intervention2,
        intervention3,
        intervention4,
        intervention5,
      ].filter(Boolean);
      return {
        title: interventions.join(", "),
      };
    },
  },
};

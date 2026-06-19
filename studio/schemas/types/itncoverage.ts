import { Map } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "itncoverage",
  type: "object",
  title: "ITN Coverage illustration",
  icon: Map,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
    }),
    defineField({
      name: "start_year",
      type: "number",
      title: "Start year",
    }),
    defineField({
      name: "end_year",
      type: "number",
      title: "End year",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image" }],
      title: "Images",
    }),
    defineField({
      name: "map_explenation",
      type: "string",
      title: "Map explenation",
    }),
    defineField({
      name: "graph_explenation",
      type: "string",
      title: "Graph explenation",
    }),
    defineField({
      name: "caption",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});

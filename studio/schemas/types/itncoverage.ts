import { Map } from "react-feather";

export default {
  name: "itncoverage",
  type: "object",
  title: "ITN Coverage illustration",
  icon: Map,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "subtitle",
      type: "string",
      title: "Subtitle",
    },
    {
      name: "start_year",
      type: "number",
      title: "Start year",
    },
    {
      name: "end_year",
      type: "number",
      title: "End year",
    },
    {
      name: "images",
      type: "array",
      of: [{ type: "image" }],
      title: "Images",
    },
    {
      name: "map_explenation",
      type: "string",
      title: "Map explenation",
    },
    {
      name: "graph_explenation",
      type: "string",
      title: "Graph explenation",
    },
    {
      name: "caption",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
} as const;

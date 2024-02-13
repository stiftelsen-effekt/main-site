import { Table } from "react-feather";

export default {
  name: "blocktable",
  type: "object",
  title: "Block Table",
  icon: Table,
  fields: [
    {
      name: "configuration",
      title: "Configuration",
      type: "object",
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
          hidden: ({ parent }) => !parent.title,
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
        {
          name: "headers",
          type: "boolean",
          title: "Headers",
          description: "Use a slightly enlarged font size for the first row.",
        },
        {
          name: "lastrow_seperator",
          type: "boolean",
          title: "Last Row Seperator",
          description:
            "Add a seperator before the last row, if the table has a footer or a total row.",
        },
        {
          name: "widthtype",
          type: "string",
          title: "Width type",
          options: {
            list: [
              { title: "Column", value: "column" },
              { title: "Full", value: "full" },
              { title: "Fixed", value: "fixed" },
            ],
            layout: "radio",
          },
        },
        {
          name: "fixedwidth",
          type: "number",
          title: "Fixed width",
          description:
            "The width of the table in rems. Only used if the width type is set to 'Fixed'.",
          hidden: ({ parent }) => parent.widthtype !== "fixed",
        },
      ],
    },
    {
      name: "table",
      type: "table",
      title: "table",
    },
  ],
  initialValue: {
    configuration: {
      headers: true,
      lastrow_seperator: true,
      widthtype: "column",
    },
  },
  preview: {
    select: {
      title: "configuration.title",
      subtitle: "configuration.subtitle",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Table",
        subtitle: subtitle,
      };
    },
  },
};

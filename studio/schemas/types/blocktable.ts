import { Table } from "react-feather";

export default {
  name: "blocktables",
  type: "object",
  title: "Tables",
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
          hidden: ({ parent }: any) => !parent.title,
        },
        {
          name: "containertype",
          type: "string",
          title: "Container type",
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
          hidden: ({ parent }: any) => parent.containertype !== "fixed",
        },
      ],
    },
    {
      name: "tables",
      type: "array",
      of: [
        {
          type: "object",
          name: "table",
          title: "Table",
          icon: Table,
          fields: [
            {
              name: "configuration",
              type: "object",
              fields: [
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
              ],
            },
            {
              name: "contents",
              type: "table",
              title: "Contents",
            },
          ],
          preview: {
            select: {
              headers: "configuration.headers",
              firstrowfirstcell: "contents.rows[0].cells[0]",
              firstrowsecondcell: "contents.rows[0].cells[1]",
              firstrowthirdcell: "contents.rows[0].cells[2]",
              firstrowfourthcell: "contents.rows[0].cells[3]",
              cellcount: "contents.rows[0].cells.length",
            },
            prepare(selection: any) {
              const {
                headers,
                firstrowfirstcell,
                firstrowsecondcell,
                firstrowthirdcell,
                firstrowfourthcell,
              } = selection;
              const firstValues = [
                firstrowfirstcell,
                firstrowsecondcell,
                firstrowthirdcell,
                firstrowfourthcell,
              ].filter(Boolean);
              return {
                title: "Table",
                subtitle: firstValues.length
                  ? firstValues.join(", ") + (selection.cellcount > 4 ? ", ..." : "")
                  : "No contents",
              };
            },
          },
        },
      ],
      validation: (Rule: any) =>
        Rule.custom((tables: any) => {
          let columnCounts = new Set();
          for (let table of tables) {
            let columnCount =
              table.contents && table.contents.rows.length > 0
                ? table.contents.rows[0].cells.length
                : 0;
            if (columnCount === 0) continue; // Skip empty tables
            columnCounts.add(columnCount);
            if (columnCounts.size > 1) {
              return "Different tables have different column counts. This will cause layout issues. Please make sure all tables have the same number of columns.";
            }
          }

          return true;
        }).warning(),
    },
    {
      name: "columnwidths",
      type: "array",
      title: "Column widths",
      description:
        "The width of each column in the table. Leave empty to use the auto layout. These widths are aspirational, i.e. they might shrink to fit content. Given in rem units. Usefull for ensuring alignment of columns over multiple tables. 0 means auto.",
      of: [
        {
          type: "number",
        },
      ],
      validation: (Rule: any) =>
        Rule.custom((columnwidths: any, context: any) => {
          if (!columnwidths) return true;
          if (columnwidths.length === 0) return true;
          let columnCounts = new Set();
          for (let table of context.parent.tables) {
            let columnCount =
              table.contents && table.contents.rows && table.contents.rows.length > 0
                ? table.contents.rows[0].cells.length
                : 0;
            if (columnCount === 0) continue; // Skip empty tables
            columnCounts.add(columnCount);
            if (columnCounts.size > 1) {
              return "Different tables have different column counts. This will cause layout issues. Please make sure all tables have the same number of columns.";
            }
          }

          if (columnCounts.size === 0) return true;

          if (columnCounts.size > 1) {
            return "Different tables have different column counts. This will cause layout issues. Please make sure all tables have the same number of columns.";
          }

          if (
            columnCounts.size === 1 &&
            columnCounts.values().next().value !== columnwidths.length
          ) {
            return `The number of column widths (${
              columnwidths.length
            }) does not match the number of columns in the tables (${
              columnCounts.values().next().value
            }).`;
          }

          return true;
        }),
    },
  ],
  initialValue: {
    configuration: {
      containertype: "column",
    },
  },
  preview: {
    select: {
      title: "configuration.title",
      subtitle: "configuration.subtitle",
    },
    prepare(selection: any) {
      const { title, subtitle } = selection;
      return {
        title: title || "Table",
        subtitle: subtitle,
      };
    },
  },
};

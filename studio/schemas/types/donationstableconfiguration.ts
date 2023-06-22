export default {
  name: "donationstableconfiguration",
  title: "Donations table configuration",
  type: "object",
  fields: [
    {
      name: "columns",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "value",
              type: "string",
              options: {
                list: [
                  {
                    title: "Donation amount",
                    value: "sum",
                  },
                  {
                    title: "Donor",
                    value: "donor",
                  },
                  {
                    title: "Payment method",
                    value: "paymentMethod",
                  },
                  {
                    title: "Transaction cost",
                    value: "transactionCost",
                  },
                  {
                    title: "Donation date",
                    value: "timestamp",
                  },
                  {
                    title: "Donation ID",
                    value: "id",
                  },
                  {
                    title: "Donor ID",
                    value: "donorId",
                  },
                  {
                    title: "Donor email",
                    value: "email",
                  },
                  {
                    title: "KID",
                    value: "KID",
                  },
                  {
                    title: "Meta owner ID",
                    value: "metaOwnerId",
                  },
                  {
                    title: "Tax unit ID",
                    value: "taxUnitId",
                  },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "type",
              type: "string",
              options: {
                list: [
                  {
                    title: "Text",
                    value: "string",
                  },
                  {
                    title: "Sum",
                    value: "sum",
                  },
                  {
                    title: "Date",
                    value: "date",
                  },
                  {
                    title: "Payment method",
                    value: "paymentmethod",
                  },
                ],
              },
            },
            {
              name: "width",
              title: "Column width in % (optional)",
              type: "number",
            },
          ],
          preview: {
            select: {
              title: "title",
              type: "type",
              width: "width",
            },
            prepare(selection: any) {
              const { title, value, type, width } = selection;
              return {
                title: `${title}`,
                subtitle: `${type} ${width ? `(width ${width}%)` : ""}`,
              };
            },
          },
        },
      ],
      // Validate that width is less than 100 over all the columns
      validation: (Rule: any) =>
        Rule.custom((columns: any) => {
          const totalWidth = columns.reduce((acc: number, column: any) => {
            return acc + (column.width || 0);
          }, 0);
          if (totalWidth > 100) {
            return "Total width of all columns must be less than 100%";
          }
          return true;
        }),
    },
    {
      name: "tax_deduction_current_year_template",
      title: "Tax deduction current year template",
      type: "string",
      description:
        "Template for the tax deduction text for the current year. Use the following variables: {{year}} for the year, and {{deduction}} for the saved tax deduction amount. Displayed below the table header for the current year if the tax deduction amount is greater than 0.",
    },
    {
      name: "tax_deduction_previous_year_template",
      title: "Tax deduction previous year template",
      type: "string",
      description:
        "Template for the tax deduction text for a previous year. Use the following variables: {{year}} for the year, and {{deduction}} for the saved tax deduction amount. Displayed below the table header for the previous year if the tax deduction amount is greater than 0.",
    },
    {
      name: "no_donations_placeholder_text",
      title: "No donations placeholder text",
      type: "array",
      of: [{ type: "block" }],
      description: "Text displayed when there are no donations in a year.",
    },
  ],
};

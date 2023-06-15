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
  ],
};

export default {
  name: "agreementlistconfiguration",
  title: "Agreement list",
  type: "object",

  fields: [
    {
      name: "title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "subtitle_text",
      title: "Subtitle text",
      type: "text",
      lines: 3,
    },
    {
      name: "list_empty_content",
      title: "Empty list content",
      type: "array",
      of: [{ type: "block" }],
    },
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
            },
            {
              name: "value",
              type: "string",
              options: {
                list: [
                  {
                    title: "Agreement ID",
                    value: "id",
                  },
                  {
                    title: "Agreement type",
                    value: "type",
                  },
                  {
                    title: "Agreement status",
                    value: "status",
                  },
                  {
                    title: "Payment date",
                    value: "date",
                  },
                  {
                    title: "Agreement amount",
                    value: "amount",
                  },
                  {
                    title: "Agreement KID",
                    value: "KID",
                  },
                  {
                    title: "Created at",
                    value: "createdAt",
                  },
                  {
                    title: "Updated at",
                    value: "updatedAt",
                  },
                  {
                    title: "Created by",
                    value: "createdBy",
                  },
                ],
              },
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
                    title: "Payment date",
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
              name: "payment_date_format_template",
              title: "Payment date format template",
              type: "string",
              description: "Use {{date}} to insert the date, e.g. 'The {{date}}th of the month'",
              hidden: ({ parent }: any) => parent?.type !== "date",
            },
            {
              name: "payment_date_last_day_of_month_template",
              title: "Payment date last day of month template",
              type: "string",
              description: "E.g. 'Last day of the month'",
              hidden: ({ parent }: any) => parent?.type !== "date",
            },
            {
              name: "width",
              title: "Column width in % (optional)",
              type: "number",
            },
            {
              name: "hide_on_mobile",
              title: "Hide on mobile",
              type: "boolean",
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
    },
    {
      name: "details_configuration",
      title: "Details configuration",
      type: "agreementlistdetailsconfiguration",
      description: "If omitted, row will not be exandable",
    },
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
};

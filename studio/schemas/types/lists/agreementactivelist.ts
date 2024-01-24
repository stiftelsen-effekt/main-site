export default {
  name: "agreementactivelistconfiguration",
  title: "Agreement active list",
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
    },
  ],
};

import { defineType, defineField } from "sanity";

export default defineType({
  name: "agreementlistconfiguration",
  title: "Agreement list",
  type: "object",

  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle_text",
      title: "Subtitle text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "list_empty_content",
      title: "Empty list content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "columns",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
            }),
            defineField({
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
            }),
            defineField({
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
            }),
            defineField({
              name: "payment_date_format_template",
              title: "Payment date format template",
              type: "string",
              description: "Use {{date}} to insert the date, e.g. 'The {{date}}th of the month'",
              hidden: ({ parent }) => parent?.type !== "date",
            }),
            defineField({
              name: "payment_date_last_day_of_month_template",
              title: "Payment date last day of month template",
              type: "string",
              description: "E.g. 'Last day of the month'",
              hidden: ({ parent }) => parent?.type !== "date",
            }),
            defineField({
              name: "width",
              title: "Column width in % (optional)",
              type: "number",
            }),
            defineField({
              name: "hide_on_mobile",
              title: "Hide on mobile",
              type: "boolean",
            }),
          ],
          preview: {
            select: {
              title: "title",
              type: "type",
              width: "width",
            },
            prepare(selection) {
              const { title, value, type, width } = selection;
              return {
                title: `${title}`,
                subtitle: `${type} ${width ? `(width ${width}%)` : ""}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "details_configuration",
      title: "Details configuration",
      type: "agreementlistdetailsconfiguration",
      description: "If omitted, row will not be exandable",
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});

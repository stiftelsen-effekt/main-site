export default {
  name: "teaser",
  type: "object",
  title: "Teaser",
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
    },
    {
      name: "disclaimer",
      type: "text",
      rows: 2,
      title: "Disclaimer",
    },
    {
      name: "image",
      type: "image",
      title: "Image",
    },
    {
      name: "link",
      type: "string",
      title: "Link",
    },
  ],
} as const;

export default {
  name: "teasersitem",
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
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
} as const;

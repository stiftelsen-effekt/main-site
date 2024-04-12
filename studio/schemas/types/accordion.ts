import { blocktype } from "./blockcontent";

export default {
  name: "accordion",
  type: "object",
  title: "Accordion",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [blocktype, { type: "latex" }],
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string }) {
      return {
        title,
      };
    },
  },
};

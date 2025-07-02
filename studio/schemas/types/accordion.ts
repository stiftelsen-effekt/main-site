import { ChevronDown } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "accordion",
  type: "object",
  title: "Accordion",
  icon: ChevronDown,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      type: "array",
      title: "Content",
      of: [
        { type: "paragraph" },
        { type: "quote" },
        { type: "columns" },
        { type: "links" },
        { type: "normalimage" },
        { type: "pointlist" },
        { type: "videoembed" },
        { type: "fullvideo" },
        { type: "blocktables" },
        { type: "newslettersignup" },
        { type: "htmlembed" },
      ],
      options: {
        modal: { type: "dialog", width: "auto" },
      },
    }),
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
});

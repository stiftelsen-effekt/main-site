import { ChevronDown } from "react-feather";

export default {
  name: "accordion",
  type: "object",
  title: "Accordion",
  icon: ChevronDown,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule: any) => Rule.required(),
    },
    {
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
        modal: "fullscreen",
      },
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

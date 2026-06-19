import { Video } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "fullvideo",
  type: "object",
  title: "Full vide",
  icon: Video,
  preview: {
    select: {
      title: "alt",
    },
  },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alternative text",
    }),
    defineField({
      name: "video",
      type: "file",
      title: "Video",
    }),
  ],
});

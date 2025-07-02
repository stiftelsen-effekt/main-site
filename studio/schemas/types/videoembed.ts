import { defineType, defineField } from "sanity";
import { Video } from "react-feather";

export default defineType({
  name: "videoembed",
  type: "object",
  title: "Videoembed",
  icon: Video,
  fields: [
    defineField({
      name: "url",
      type: "string",
      title: "Youtube url",
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      title: "Thumbnail",
    }),
  ],
});

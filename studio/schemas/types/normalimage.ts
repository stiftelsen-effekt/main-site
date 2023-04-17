import { Image } from "react-feather";

export default {
  name: "normalimage",
  type: "object",
  title: "Normal image",
  icon: Image,
  preview: {
    select: {
      media: "image",
      title: "caption",
    },
  },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
    },
    {
      name: "image",
      type: "image",
      title: "Image",
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
    },
    {
      name: "grayscale",
      type: "boolean",
      title: "Grayscale",
    },
  ],
};

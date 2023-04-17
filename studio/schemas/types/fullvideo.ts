import { Video } from "react-feather";

export default {
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
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
    },
    {
      name: "video",
      type: "file",
      title: "Video",
    },
  ],
};

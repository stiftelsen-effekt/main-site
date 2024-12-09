import { MessageSquare } from "react-feather";

export default {
  name: "generalbanner",
  type: "document",
  title: "Site banner",
  icon: MessageSquare,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "link",
      type: "navitem",
      title: "Link",
    },
  ],
} as const;

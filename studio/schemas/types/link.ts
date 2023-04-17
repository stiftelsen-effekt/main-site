import { Link } from "react-feather";

export default {
  name: "link",
  type: "document",
  title: "Link",
  icon: Link,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description: "Not needed if link in text",
    },
    {
      name: "url",
      type: "string",
      title: "Url",
    },
    {
      name: "newtab",
      type: "boolean",
      title: "Open in new tab",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "url",
    },
  },
} as const;

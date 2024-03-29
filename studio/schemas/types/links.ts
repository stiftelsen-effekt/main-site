import { Link } from "react-feather";
import { LinksPreview } from "../../components/linksPreview";

export default {
  title: "Links",
  name: "links",
  type: "object",
  icon: Link,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for the links",
    },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
  preview: {
    select: {
      links: "links",
    },
    component: LinksPreview,
  },
} as const;

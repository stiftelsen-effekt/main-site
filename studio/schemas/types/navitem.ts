import { Link } from "react-feather";
import { pages } from "../pages/_pages";
import { dashboardpages } from "../dashboard/_dashboardPages";

export default {
  name: "navitem",
  type: "document",
  title: "Navigation item",
  icon: Link,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description: "Not needed if link in text",
    },
    {
      name: "page",
      title: "Page",
      type: "reference",
      to: [
        ...[
          ...pages.map((p) => ({ type: p.name })),
          ...dashboardpages.map((p) => ({ type: p.name })),
        ],
      ],
    },
  ],
} as const;

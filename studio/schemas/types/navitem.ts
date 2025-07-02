import { defineType, defineField } from "sanity";
import { Link } from "react-feather";
import { pages } from "../pages/_pages";
import { dashboardpages } from "../dashboard/_dashboardPages";
import { NavigationItemPreview } from "../../components/navigationItemPreview";

export default defineType({
  name: "navitem",
  type: "document",
  title: "Navigation item",
  icon: Link,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Not needed if link in text",
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "reference",
      to: [
        ...[
          ...pages.map((p) => ({ type: p.name })),
          ...dashboardpages.map((p) => ({ type: p.name })),
        ],
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "page.slug.current",
    },
  },
  components: {
    preview: NavigationItemPreview,
  },
});

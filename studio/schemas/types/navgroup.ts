import { defineType, defineField } from "sanity";
import { List } from "react-feather";
import { NavigationGroupPreview } from "../../components/navigationGroupPreview";

export default defineType({
  title: "Navigation group",
  name: "navgroup",
  type: "object",
  icon: List,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "navitem" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      item1slug: "items.0.page.slug.current",
      item2slug: "items.1.page.slug.current",
      item3slug: "items.2.page.slug.current",
      item4slug: "items.3.page.slug.current",
      item5slug: "items.4.page.slug.current",
      item6slug: "items.5.page.slug.current",
      item7slug: "items.6.page.slug.current",
      item8slug: "items.7.page.slug.current",
      item9slug: "items.8.page.slug.current",
    },
  },
  components: {
    preview: NavigationGroupPreview,
  },
});

import { Link } from "react-feather";
import { LinksPreview } from "../../components/linksPreview";
import { defineType, defineField } from "sanity";

export default defineType({
  title: "Links",
  name: "links",
  type: "object",
  icon: Link,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for the links",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
  components: {
    preview: LinksPreview,
  },
});

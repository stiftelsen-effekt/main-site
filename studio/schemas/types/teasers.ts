import { defineType, defineField } from "sanity";
import { Layers } from "react-feather";
import { TeasersPreview } from "../../components/teasersPreview";

export default defineType({
  name: "teasers",
  type: "document",
  title: "Teasers",
  icon: Layers,
  fields: [
    defineField({
      name: "teasers",
      type: "array",
      title: "Teasers",
      of: [{ type: "teasersitem" }],
    }),
  ],

  preview: {
    select: {
      teasers: "teasers",
    },
  },
  components: {
    preview: TeasersPreview,
  },
});

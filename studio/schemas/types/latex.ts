import { Divide } from "react-feather";
import KatexInput from "../../components/katexInput";
import { KatexPreview } from "../../components/katexPreview";
import { TexIcon } from "../../components/texIcon";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "latex",
  type: "object",
  icon: TexIcon,
  title: "Block",
  components: {
    input: KatexInput,
    preview: KatexPreview,
  },
  fields: [
    defineField({
      name: "latex",
      type: "text",
      title: "Latex",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "renderedHtml",
      type: "text",
      title: "Rendered",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      latex: "latex",
      renderedHtml: "renderedHtml",
    },
  },
});

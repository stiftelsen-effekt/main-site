import { Columns } from "react-feather";
import { ColumnsPreview } from "../../components/columnsPreview";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "columns",
  type: "object",
  title: "Columns",
  icon: Columns,
  fields: [
    defineField({
      name: "columns",
      type: "array",
      of: [{ type: "column" }],
    }),
  ],
  preview: {
    select: {
      columns: "columns",
    },
  },
  components: {
    preview: ColumnsPreview,
  },
});

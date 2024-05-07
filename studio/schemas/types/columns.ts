import { Columns } from "react-feather";
import { ColumnsPreview } from "../../components/columnsPreview";

export default {
  name: "columns",
  type: "object",
  title: "Columns",
  icon: Columns,
  fields: [
    {
      name: "columns",
      type: "array",
      of: [{ type: "column" }],
    },
  ],
  preview: {
    select: {
      columns: "columns",
    },
  },
  components: {
    preview: ColumnsPreview,
  },
} as const;

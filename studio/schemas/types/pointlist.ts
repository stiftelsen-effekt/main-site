import { List } from "react-feather";
import { PointlistPreview } from "../../components/pointlistPeview";

export default {
  name: "pointlist",
  type: "document",
  title: "Pointlist",
  icon: List,
  fields: [
    {
      name: "numbered",
      type: "boolean",
      title: "Numbered",
    },
    {
      name: "points",
      type: "array",
      title: "Points",
      of: [{ type: "pointlistpoint" }],
    },
  ],
  preview: {
    select: {
      numbered: "numbered",
      points: "points",
    },
    component: PointlistPreview,
  },
};

import { Link } from "react-feather";
import { LinksPreview } from "../../components/linksPreview";

export default {
  title: 'Links', 
  name: 'links',
  type: 'object',
  icon: Link,
  fields: [
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'link' }]
    },
  ],
  preview: {
    select: {
      links: 'links'
    },
    component: LinksPreview
  }
}

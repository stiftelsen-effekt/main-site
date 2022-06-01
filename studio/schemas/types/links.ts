import { Link } from "react-feather";

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
  ]
}

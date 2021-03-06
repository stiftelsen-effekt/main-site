import { Link } from "react-feather";
import { pages } from "../schema";

export default {
  name: 'navitem',
  type: 'document',
  title: 'Navigation item',
  icon: Link,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [
        ...pages.map(p => ({ type: p.name }))
      ],
    },
  ]
}
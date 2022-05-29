import { Link } from "react-feather";

export default {
  name: 'link',
  type: 'document',
  title: 'Link',
  icon: Link,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'url',
      type: 'string',
      title: 'Url'
    }
  ]
}
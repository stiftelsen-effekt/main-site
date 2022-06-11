import { Sunset } from "react-feather";

export default {
  name: 'articleheader',
  type: 'document',
  title: 'Article header',
  icon: Sunset,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'inngress',
      title: 'Inngress',
      type: 'text',
      rows: 3
    },
    {
      name: 'published',
      title: 'Published',
      type: 'date'
    },
  ]
}
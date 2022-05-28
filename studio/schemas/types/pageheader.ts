import { Sunset } from "react-feather";

export default {
  name: 'pageheader',
  type: 'document',
  title: 'Page header',
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
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'link' }]
    },
  ]
}
import { Columns } from "react-feather";

export default {
  name: 'splitview',
  type: 'object',
  icon: Columns,
  title: 'Split view',
  preview: {
    select: {
      title: 'title',
      media: 'image'
    }
  },
  fields: [
    {
      name: 'swapped',
      type: 'boolean',
      title: 'Swapped'
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'paragraph',
      type: 'text',
      rows: 3,
      title: 'Paragraph'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image'
    },
    {
      name: 'link',
      type: 'string',
      title: 'Link'
    }
  ]
}
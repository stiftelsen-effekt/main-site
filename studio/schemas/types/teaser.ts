export default {
  name: 'teaser',
  type: 'object',
  title: 'Teaser',
  preview: {
    select: {
      title: 'title',
      media: 'image'
    }
  },
  fields: [
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
    }
  ]
}
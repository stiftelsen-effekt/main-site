export default {
  name: 'introsection',
  type: 'object',
  title: 'Intro section',
  fields: [
    {
      name: 'heading',
      type: 'text',
      rows: 3,
      title: 'Heading'
    },
    {
      name: 'paragraph',
      type: 'text',
      rows: 3,
      title: 'Paragraph'
    },
    {
      name: 'slug',
      type: 'string',
      title: 'Link target'
    }
  ]
}

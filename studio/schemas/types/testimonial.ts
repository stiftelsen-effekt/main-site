export default {
  name: 'testimonial',
  type: 'object',
  title: 'Testimonial',
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image'
    }
  },
  fields: [
    {
      name: 'quote',
      type: 'text',
      rows: 3,
      title: 'Quote'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image'
    },
    {
      name: 'quotee',
      type: 'string',
      title: 'Quotee',
    },
    {
      name: 'quotee_background',
      type: 'string',
      title: 'Quotee backgrond'
    },
  ]
}

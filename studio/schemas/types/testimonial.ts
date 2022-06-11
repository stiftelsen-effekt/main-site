export default {
  name: 'testimonial',
  type: 'document',
  title: 'Testimonial',
  preview: {
    select: {
      title: 'quotee',
      subtitle: 'quotee_background',
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

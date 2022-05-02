export default {
  name: 'frontpage',
  type: 'document',
  title: 'Frontpage',
  fields: [
    {
      name: 'main_heading',
      type: 'string',
      title: 'Main heading'
    },
    {
      name: 'sub_heading',
      type: 'string',
      title: 'Sub heading'
    },
    {
      name: 'sub_heading_link_target',
      type: 'string',
      title: 'Sub heading link target'
    },
    {
      name: 'key_points',
      type: 'array',
      title: 'Key points',
      of: [{ type: 'key_point' }]
    },
    {
      name: 'testimonials',
      type: 'array',
      title: 'Testimonials',
      of: [{ type: 'testimonial' }],
    },
  ]
}

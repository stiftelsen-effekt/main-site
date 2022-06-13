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
      name: 'introsection',
      type: 'introsection',
      title: 'Intro section'
    },
    {
      name: 'intervention_widget',
      type: 'interventionwidget',
      title: 'Intervention widget'
    },
    {
      name: 'salespitch',
      type: 'pointlist',
      title: 'Salespitch',
    },
    {
      name: 'teasers',
      type: 'array',
      title: 'Teasers',
      of: [{ type: 'teaser' }],
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
      of: [{ type: 'reference', to: { type: 'testimonial' }}],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
      initialValue: ''
    }
  ],
  preview: {
    select: {
      title: 'main_heading'
    }
  }
}

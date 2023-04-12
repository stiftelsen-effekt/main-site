export default {
  name: 'frontpage',
  type: 'document',
  title: 'Frontpage',
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    {
      name: 'main_heading',
      type: 'text',
      title: 'Main heading'
    },
    {
      name: 'sub_heading',
      type: 'text',
      title: 'Sub heading'
    },
    {name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'},
    {name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, group: 'seo'},
    {name: 'seoImage', title: 'SEO Image', type: 'image', group: 'seo'},
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
      title: 'Sitemap priority',
      name: 'sitemap_priority',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(1)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: true,
      initialValue: ''
    }
  ],
  preview: {
    select: {
      title: 'main_heading'
    }
  }
} as const
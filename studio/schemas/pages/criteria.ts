export default {
  name: 'criteria',
  type: 'document',
  title: 'Criteria',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{ type: 'contentsection' }]
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
      readOnly: false,
      initialValue: 'criteria',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
} as const

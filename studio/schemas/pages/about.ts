export default {
  title: 'About us page', 
  name: 'about_us',
  type: 'document',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
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
      initialValue: 'about',
      validation: (Rule: any) => Rule.required()
    },
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}
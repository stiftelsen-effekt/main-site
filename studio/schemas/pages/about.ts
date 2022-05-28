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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: true,
      initialValue: '/about'
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}
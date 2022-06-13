export default {
  title: 'Articles page', 
  name: 'articles',
  type: 'document',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
    },
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}
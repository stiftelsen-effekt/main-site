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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
      initialValue: 'criteria'
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}

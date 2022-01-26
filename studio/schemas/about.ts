export default {
  title: 'About us', 
  name: 'about_us',
  type: 'document', 
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    }
  ]
}
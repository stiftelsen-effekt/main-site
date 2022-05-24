export default {
  title: 'About us page', 
  name: 'about_us',
  type: 'document', 
  fields: [
    {
      name: 'surprise',
      title: 'Surprise',
      type: 'text'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    }
  ]
}
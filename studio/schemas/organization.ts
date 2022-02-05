export default {
  name: 'organization',
  type: 'document',
  title: 'Organization',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name'
    },
    {
      name: 'abbriviation',
      type: 'string',
      title: 'Abbriviation'
    },
    {
      name: 'homepage',
      type: 'string',
      title: 'Homepage'
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean'
    },
  ]
}
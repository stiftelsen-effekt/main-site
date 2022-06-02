export default {
  name: 'pointlist',
  type: 'document',
  title: 'Pointlist',
  fields: [
    {
      name: 'numbered',
      type: 'boolean',
      title: 'Numbered'
    },
    {
      name: 'points',
      type: 'array',
      title: 'Points',
      of: [{ type: 'pointlistpoint' }]
    }
  ]
}
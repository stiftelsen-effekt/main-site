import { List } from "react-feather";

export default {
  title: 'Navigation group', 
  name: 'navgroup',
  type: 'object', 
  icon: List,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'reference', to: [{ type: 'navitem' }]}]
    }
  ]
}
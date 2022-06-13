import { Columns } from "react-feather";

export default {
  name: 'columns',
  type: 'object',
  title: 'Columns',
  icon: Columns,
  fields: [
    {
      name: 'columns',
      type: 'array',
      of: [{ type: 'column' }]
    }
  ]
}
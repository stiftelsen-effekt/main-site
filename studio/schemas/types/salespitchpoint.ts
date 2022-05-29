import { Star } from "react-feather";

export default {
  name: 'salespitchpoint',
  type: 'object',
  title: 'Salespitch point',
  icon: Star,
  fields: [
    {
      name: 'heading',
      type: 'string',
      title: 'Heading'
    },
    {
      name: 'paragraph',
      type: 'text',
      rows: 3,
      title: 'Paragraph'
    }
  ]
}

import { Code } from "react-feather";

export default {
  name: 'htmlembed',
  type: 'object',
  title: 'HTML Embed',
  icon: Code,
  fields: [
    {
      name: 'htmlcode',
      type: 'text',
      lines: 10,
      title: 'HTML code'
    },
    {
      name: 'grayscale',
      type: 'boolean',
      title: 'Grayscale'
    }
  ]
}
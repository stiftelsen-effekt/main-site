import { Check } from "react-feather";

export default {
  name: 'key_point',
  type: 'object',
  title: 'Key point',
  icon: Check,
  fields: [
    {
      name: 'heading',
      type: 'string',
      title: 'Heading'
    },
    {
      name: 'body',
      type: 'string',
      title: 'body'
    },
  ]
}

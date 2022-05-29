import { HelpCircle } from "react-feather";

export default {
  name: 'questionandanswer',
  type: 'object',
  title: 'Q&A',
  icon: HelpCircle,
  fields: [
    {
      name: 'question',
      type: 'string',
      title: 'Question'
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
    },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'link' }]
    },
  ]
}
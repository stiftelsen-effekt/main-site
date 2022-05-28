import { HelpCircle } from "react-feather";

export default {
  name: 'questionandanswergroup',
  type: 'object',
  title: 'Q&A',
  icon: HelpCircle,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'answers',
      title: 'Question and andswers',
      type: 'array',
      of: [{ type: 'questionandanswer' }]
    },
  ]
}
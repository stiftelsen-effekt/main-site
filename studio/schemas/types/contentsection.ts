import { FileText } from "react-feather";

export default {
  name: 'contentsection',
  type: 'document',
  title: 'Content section',
  icon: FileText,
  fields: [
    {
      name: 'heading',
      type: 'string',
      title: 'Header'
    },
    {
      name: 'nodivider',
      type: 'boolean',
      title: 'No divider line'
    },
    {
      name: 'inverted',
      type: 'boolean',
      title: 'Inverted'
    },
    {
      name: 'blocks',
      type: 'array',
      title: 'Content',
      of: [
        { type: 'questionandanswergroup' }, 
        { type: 'videoembed' },
        { type: 'introsection' }, 
        { type: 'paragraph' },
        { type: 'pointlist' },
        { type: 'links' },
        { type: 'reference', to: [{ type: 'contactinfo' }]}
      ]
    }
  ]
}

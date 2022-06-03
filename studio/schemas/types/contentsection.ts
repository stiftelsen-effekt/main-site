import { FileText, Phone } from "react-feather";
import { SectionPreview } from "../../components/sectionPreview";

export default {
  name: 'contentsection',
  type: 'document',
  title: 'Section',
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
      name: 'padded',
      type: 'boolean',
      title: 'Left right padded'
    },
    {
      name: 'blocks',
      type: 'array',
      title: 'Content',
      of: [
        { type: 'paragraph' },
        { type: 'pointlist' },
        { type: 'links' },
        { type: 'questionandanswergroup' },
        { type: 'introsection' }, 
        { type: 'videoembed' },
        { type: 'reference', to: [{ type: 'contactinfo' }], icon: Phone}
      ]
    }
  ],
  preview: {
    select: {
      title: 'heading',
    },
    component: SectionPreview
  }
}

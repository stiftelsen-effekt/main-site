import { Sunset } from "react-feather";
import HeaderLayoutSelector from '../../components/pointlistPeview';

export default {
  name: 'pageheader',
  type: 'document',
  title: 'Page header',
  icon: Sunset,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'inngress',
      title: 'Inngress',
      type: 'text',
      rows: 3
    },
    {
      name: 'centered',
      title: 'Centered',
      type: 'boolean',
      inputComponent: HeaderLayoutSelector
    },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'link' }]
    },
  ]
}
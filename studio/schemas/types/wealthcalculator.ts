import { DollarSign } from "react-feather";
import { ColumnsPreview } from "../../components/columnsPreview";

export default {
  name: 'wealthcalculator',
  type: 'object',
  title: 'Wealth Calculator',
  icon: DollarSign,
  fields: [
    {
      name: 'data_explanation',
      type: 'reference',
      to: [{ type: 'contentsection' }],
      title: 'Data Explanation',
      options: {
        disableNew: false
      }
    },
    {
      name: 'show_impact',
      type: 'boolean',
      title: 'Show Impact',
    },
    {
      name: 'interventions',
      type: 'array',
      of: [{ type: 'intervention' }]
    },
  ]
}
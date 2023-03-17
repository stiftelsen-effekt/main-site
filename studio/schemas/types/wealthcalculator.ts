import { DollarSign } from "react-feather";
import { ColumnsPreview } from "../../components/columnsPreview";

export default {
  name: 'wealthcalculator',
  type: 'object',
  title: 'Wealth Calculator',
  icon: DollarSign,
  fields: [
    {
      name: 'show_impact',
      type: 'boolean',
      title: 'Show Impact',
    }
  ]
}
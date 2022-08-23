export default {
  name: 'donationwidget',
  type: 'document',
  title: 'Donation widget',
  groups: [
    {
      name: 'pane1',
      title: 'Pane 1',
      default: true
    },
    {
      name: 'pane2',
      title: 'Pane 2'
    },
    {
      name: 'pane3_bank_recurring',
      title: 'Pane 3 - Bank recurring'
    },
    {
      name: 'pane3_vipps_recurring',
      title: 'Pane 3 - Vipps recurring'
    },
    {
      name: 'pane3_bank_single',
      title: 'Pane 3 - Bank single'
    },
    {
      name: 'pane3_vipps_single',
      title: 'Pane 3 - Vipps single'
    },
    {
      name: 'referrals',
      title: 'Referrals'
    },
  ],
  fields: [
    //Single / monthly donation text
    {
      name: 'single_donation_text',
      title: 'Single donation option text',
      type: 'string',
      group: 'pane1',
    },
    {
      name: 'monthly_donation_text',
      title: 'Monthly donation option text',
      type: 'string',
      group: 'pane1',
    },
    // 3 Preset donation amount values
    {
      name: 'preset_donation_amount_1',
      title: 'Preset donation amount 1',
      type: 'number',
      group: 'pane1',
    },
    {
      name: 'preset_donation_amount_2',
      title: 'Preset donation amount 2',
      type: 'number',
      group: 'pane1',
    },
    {
      name: 'preset_donation_amount_3',
      title: 'Preset donation amount 3',
      type: 'number',
      group: 'pane1',
    },
    //Smart fordeling / Choose your own text
    {
      name: 'smart_fordeling_text',
      title: 'Smart fordeling text',
      type: 'string',
      group: 'pane1',
    },
    {
      name: 'choose_your_own_text',
      title: 'Choose your own text',
      type: 'string',
      group: 'pane1',
    },
    {
      name: 'smart_fordeling_description',
      title: 'Smart fordeling forklaring',
      type: 'text',
      rows: 3,
      group: 'pane1',
    },
    //Button text
    {
      name: 'button_text',
      title: 'Button text',
      type: 'string',
      group: 'pane1',
    },
  ]
}
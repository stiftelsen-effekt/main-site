import { DonationList } from "../../components/lists/donationList/donationList";
import { Distribution, Donation } from "../../models";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Lists/DonationsList",
  component: DonationList
}

const distributions = new Map<string, Distribution>()
distributions.set('123456789', { kid: '123456789', 
  organizations: [
    {
      id: 1,
      name: "Against Malaria foundation",
      share: '70.00'
    },
    {
      id: 2,
      name: "Schistosomiasis Control Initiative",
      share: '30.00'
    }
  ]
})

const donations: Donation[] = [{
  id: 1,
  KID: '123456789',
  sum: '200.00',
  donor: 'Jack Torrence',
  email: 'jack@overlookhotel.com',
  donorId: 237,
  paymentMethod: 'Bank',
  timestamp: "2022-03-21T03:00:20.000Z",
  transactionCost: '22.00'
}]

export const List = () => <DonationList 
  year={'2020'} 
  distributions={distributions} 
  donations={donations}  />

export const Empty = () => <DonationList 
  year={'2020'} 
  distributions={distributions} 
  donations={[]}  />

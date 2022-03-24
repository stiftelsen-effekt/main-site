import { AgreementList } from "../../components/lists/agreementList/agreementList";
import { DonationList } from "../../components/lists/donationList/donationList";
import { AvtaleGiroAgreement, Distribution, Donation } from "../../models";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Lists/AgreementList",
  component: AgreementList
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

const avtalegiro: AvtaleGiroAgreement[] = [{
  ID: 1,
  active: true,
  amount: 10000,
  KID: '123456789',
  payment_date: 14,
  created: "2022-03-21T03:00:20.000Z",
  last_updated: "2022-03-21T03:00:20.000Z",
  notice: false,
  full_name: 'Jack Torrence'
}]

export const List = () => <AgreementList 
  avtalegiro={avtalegiro} vipps={[]} title={'Aktive'} supplemental={''} />

export const Empty = () => <AgreementList 
  avtalegiro={[]} vipps={[]} title={'Aktive'} supplemental={''} />
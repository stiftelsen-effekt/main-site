import { AgreementList } from "../../components/profile/shared/lists/agreementList/AgreementList";
import { AvtaleGiroAgreement, Distribution, Donation } from "../../models";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Lists/AgreementList",
  component: AgreementList,
};

const distributions = new Map<string, Distribution>();
distributions.set("123456789", {
  kid: "123456789",
  organizations: [
    {
      id: 1,
      name: "Against Malaria foundation",
      share: "70.00",
    },
    {
      id: 2,
      name: "Schistosomiasis Control Initiative",
      share: "30.00",
    },
    {
      id: 3,
      name: "Org 3",
      share: "0",
    },
    {
      id: 4,
      name: "Org 4",
      share: "0",
    },
    {
      id: 5,
      name: "Org 5",
      share: "0",
    },
    {
      id: 6,
      name: "Org 6",
      share: "0",
    },
    {
      id: 7,
      name: "Org 7",
      share: "0",
    },
    {
      id: 8,
      name: "Org 8",
      share: "0",
    },
    {
      id: 9,
      name: "Org 9",
      share: "0",
    },
  ],
});

const avtalegiro: AvtaleGiroAgreement[] = [
  {
    ID: 1,
    active: 1,
    amount: "10000.00",
    KID: "123456789",
    payment_date: 14,
    created: "2022-03-21T03:00:20.000Z",
    last_updated: "2022-03-21T03:00:20.000Z",
    notice: false,
    full_name: "Jack Torrence",
    cancelled: "",
  },
];

export const List = () => (
  <AgreementList
    distributions={distributions}
    avtalegiro={avtalegiro}
    vipps={[]}
    title={"Aktive"}
    supplemental={""}
  />
);

export const Empty = () => (
  <AgreementList
    distributions={distributions}
    avtalegiro={[]}
    vipps={[]}
    title={"Aktive"}
    supplemental={""}
  />
);

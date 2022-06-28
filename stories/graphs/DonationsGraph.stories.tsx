import DonationsChart from "../../components/profile/donations/DonationsChart/DonationsChart";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Charts/DonationsChart",
  component: DonationsChart,
};

const distributions = [
  {
    org: "Against Malaria Foundation",
    sum: 200000,
  },
  {
    org: "Schistosomiasis Control Initiative",
    sum: 160000,
  },
  {
    org: "Drift",
    sum: 50000,
  },
];

export const Chart = () => <DonationsChart distribution={distributions} />;

export const Empty = () => <DonationsChart distribution={[]} />;

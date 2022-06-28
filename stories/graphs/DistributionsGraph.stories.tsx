import { DonationsDistributionGraph } from "../../components/profile/donations/DonationsDistributionGraph/DonationsDistributionGraph";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Charts/DonationDistributionGraph",
  component: DonationsDistributionGraph,
};

const distribution = {
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
  ],
};

export const Chart = () => (
  <DonationsDistributionGraph sum={"2000.00"} distribution={distribution} />
);

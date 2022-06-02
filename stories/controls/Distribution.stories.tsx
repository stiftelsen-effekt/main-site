import { useState } from "react";
import { DistributionController } from "../../components/elements/distribution";
import { Distribution } from "../../models";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Controls/Distribution",
  component: DistributionController,
};

const defaultDistribution: Distribution = {
  kid: "000111",
  organizations: [
    {
      id: 1,
      name: "Against Malaria Foundation",
      share: "70.00000",
    },
    {
      id: 12,
      name: "GiveWells tildelingsfond",
      share: "30.00000",
    },
    {
      id: 2,
      name: "Hellen Keller International",
      share: "0.00000",
    },
    {
      id: 3,
      name: "Malaria Consortium",
      share: "0.00000",
    },
    {
      id: 4,
      name: "Schistosomiasis Control Initiative",
      share: "0.00000",
    },
    {
      id: 5,
      name: "GiveDirectly",
      share: "0.00000",
    },
    {
      id: 6,
      name: "GiveDirectly Borgerlønn",
      share: "0.00000",
    },
    {
      id: 7,
      name: "New Incentives",
      share: "0.00000",
    },
    {
      id: 8,
      name: "Drift av gieffektivt.no",
      share: "0.00000",
    },
  ],
};

export const DistributionControl = ({ ...args }) => {
  const [distribution, setDistribution] = useState<Distribution>(defaultDistribution);
  return (
    <DistributionController
      distribution={distribution}
      onChange={(newdist) => setDistribution(newdist)}
    />
  );
};

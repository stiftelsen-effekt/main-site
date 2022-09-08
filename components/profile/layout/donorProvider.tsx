import { useAuth0, User } from "@auth0/auth0-react";
import React, { createContext, useState } from "react";
import { Donor } from "../../../models";
import { useDonor } from "../../../_queries";
import { FullPageError } from "../../shared/layout/FullPageError/FullPageError";
import { FullPageSpinner } from "../../shared/layout/FullPageSpinner/FullPageSpinner";

export const DonorContext = createContext<{
  donor: Donor | null;
  setDonor: React.Dispatch<React.SetStateAction<Donor | null>>;
}>({ donor: null, setDonor: () => {} });

export const DonorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [donor, setDonor] = useState<Donor | null>(null);

  const { loading, error, data } = useDonor(user as User, getAccessTokenSilently);

  if (loading) {
    return <FullPageSpinner />;
  } else if (error) {
    console.error(error);
    return <FullPageError error={error.message} />;
  } else if (!donor) {
    setDonor(data);
  }

  return <DonorContext.Provider value={{ donor, setDonor }}>{children}</DonorContext.Provider>;
};

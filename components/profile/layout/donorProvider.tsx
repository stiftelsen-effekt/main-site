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
  const { loading, error, data } = useDonor(user, getAccessTokenSilently);
  const noData =
    typeof data !== "undefined" && (data === null || (Array.isArray(data) && data.length === 0));
  const fetchedDonor: Donor | null = !noData && data !== undefined ? data : null;

  // Local updates (e.g. after saving the donor) apply until the fetched donor changes
  const [localDonor, setLocalDonor] = useState<{ base: Donor | null; donor: Donor | null } | null>(
    null,
  );
  const donor = localDonor && localDonor.base === fetchedDonor ? localDonor.donor : fetchedDonor;

  const setDonor: React.Dispatch<React.SetStateAction<Donor | null>> = (action) => {
    setLocalDonor((prev) => {
      const current = prev && prev.base === fetchedDonor ? prev.donor : fetchedDonor;
      return {
        base: fetchedDonor,
        donor: typeof action === "function" ? action(current) : action,
      };
    });
  };

  if (loading && user) {
    return <FullPageSpinner />;
  } else if (error) {
    return <FullPageError error={error.message} />;
  } else if (user && noData) {
    return <FullPageError title="No data available" />;
  }

  return <DonorContext.Provider value={{ donor, setDonor }}>{children}</DonorContext.Provider>;
};

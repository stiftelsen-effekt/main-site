import { useAuth0 } from '@auth0/auth0-react';
import React, { createContext, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Donor } from '../../models';
import { Spinner } from '../elements/spinner';

export const DonorContext = createContext<{donor: Donor | null, setDonor: React.Dispatch<React.SetStateAction<Donor | null>> }>({ donor: null, setDonor: () => {} });

export const DonorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [donor, setDonor] = useState<Donor | null>(null);
  
  const { loading, error, data } = useApi<Donor>(
    `/donors/${user ? user["https://konduit.no/user-id"] : ""}/`,
    "GET",
    "read:donations",
    getAccessTokenSilently,
  );

  if (loading)  {
    return <Spinner />;
  } else if (error) {
    return <div>Noe gikk galt </div>
  } else if (!donor) {
    setDonor(data)
  };

  return (
    <DonorContext.Provider value={{donor, setDonor}}>
      {children}
    </DonorContext.Provider>
  );
};
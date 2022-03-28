import { useAuth0 } from '@auth0/auth0-react';
import React, { createContext, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Donor } from '../../models';
import { ActivityIndicator } from '../elements/activityindicator';
import { Spinner } from '../elements/spinner';

export const ActivityContext = createContext<{ activity: boolean, setActivity: React.Dispatch<React.SetStateAction<boolean>> }>({ activity: false, setActivity: () => {} });

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activity, setActivity] = useState<boolean>(false);

  const indicator = <ActivityIndicator active={activity} />;

  return (
    <ActivityContext.Provider value={{activity, setActivity}}>
      {indicator}
      {children}
    </ActivityContext.Provider>
  );
};
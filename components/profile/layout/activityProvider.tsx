import React, { createContext, useState } from "react";
import { ActivityIndicator } from "./ActivityIndicator/ActivityIndicator";

export const ActivityContext = createContext<{
  activity: boolean;
  setActivity: React.Dispatch<React.SetStateAction<boolean>>;
}>({ activity: false, setActivity: () => {} });

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activity, setActivity] = useState<boolean>(false);

  const indicator = <ActivityIndicator active={activity} />;

  return (
    <ActivityContext.Provider value={{ activity, setActivity }}>
      {indicator}
      {children}
    </ActivityContext.Provider>
  );
};

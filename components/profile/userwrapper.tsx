import { useAuth0 } from "@auth0/auth0-react";
import React, { ReactChildren } from "react";
import { Spinner } from "../elements/spinner";

export const UserWrapper: React.FC<{ children: React.ReactNode[] }> = ({ children }) => {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    user
  } = useAuth0();

  if (!isAuthenticated && !isLoading)
    loginWithRedirect()

  if (!user)
    return <Spinner /> // In the process of redirecting

  return <>{children}</>
}
import { useAuth0 } from "@auth0/auth0-react";
import React, { ReactChildren } from "react";
import { Spinner } from "../elements/spinner";
import { LoginError } from "./loginError";

export const UserWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    user,
    error
  } = useAuth0();

  if (!isAuthenticated && !isLoading && !error)
    loginWithRedirect()

  if (error)
    return <LoginError message={error.message}></LoginError>

  if (!user)
    return <Spinner /> // In the process of redirecting

  return <>{children}</>
}
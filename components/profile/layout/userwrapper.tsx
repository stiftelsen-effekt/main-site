import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { FullPageSpinner } from "../../shared/layout/FullPageSpinner/FullPageSpinner";
import { LoginError } from "./LoginError/LoginError";

export const UserWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isAuthenticated, loginWithRedirect, user, error } = useAuth0();

  if (!isAuthenticated && !isLoading && !error) loginWithRedirect();

  if (error) return <LoginError message={error.message}></LoginError>;

  if (!user) return <FullPageSpinner />; // In the process of redirecting

  return <>{children}</>;
};

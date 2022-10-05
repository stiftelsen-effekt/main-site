import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { FullPageSpinner } from "../../shared/layout/FullPageSpinner/FullPageSpinner";
import { LoginError } from "./LoginError/LoginError";

type PromptValues = "login" | "consent" | "none" | "select_account" | undefined;
export const UserWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isAuthenticated, loginWithRedirect, user, error } = useAuth0();

  let screenHint;
  let prompt: PromptValues;
  if (typeof window !== "undefined") {
    let urlParams = new URLSearchParams(window.location.search);
    screenHint = urlParams.get("screen_hint");
    prompt = urlParams.get("prompt") as PromptValues;
  }

  if (!isAuthenticated && !isLoading && !error)
    loginWithRedirect({
      screen_hint: screenHint ? screenHint : undefined,
      prompt: prompt ? prompt : undefined,
    });

  if (error) return <LoginError message={error.message}></LoginError>;

  if (!user) return <FullPageSpinner />; // In the process of redirecting

  return <>{children}</>;
};

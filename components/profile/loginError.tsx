import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import elements from "../../styles/Elements.module.css";
import { EffektButton } from "../elements/effektbutton";

export const LoginError: React.FC<{ message: string }> = ({ message }) => {
  const {
    loginWithRedirect
  } = useAuth0();

  return <div className={elements["center-wrapper"]}>
    <p>{message}</p>
    <EffektButton onClick={loginWithRedirect}>Logg in</EffektButton>
  </div>
}
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import elements from "../../styles/Elements.module.css";

export const LoginError: React.FC<{ message: string }> = ({ message }) => {
  const {
    loginWithRedirect
  } = useAuth0();

  return <div className={elements["center-wrapper"]}>
    <p>{message}</p>
    <button 
      className={elements["konduit-button"]}
      onClick={loginWithRedirect}>Logg in</button>
  </div>
}
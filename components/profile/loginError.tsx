import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import elements from "../../styles/Elements.module.css";
import { EffektButton, EffektButtonType } from "../elements/effektbutton";

export const LoginError: React.FC<{ message: string }> = ({ message }) => {
  const { loginWithRedirect, logout } = useAuth0();

  return (
    <div className={elements["center-wrapper"]}>
      <p>{message}</p>
      <div>
        <EffektButton onClick={logout} type={EffektButtonType.SECONDARY}>
          Logg ut
        </EffektButton>
        <EffektButton onClick={loginWithRedirect} cy="btn-login">
          Logg inn
        </EffektButton>
      </div>
    </div>
  );
};

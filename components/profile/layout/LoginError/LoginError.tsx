import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import elements from "./LoginError.module.scss";
import {
  EffektButton,
  EffektButtonType,
} from "../../../shared/components/EffektButton/EffektButton";
import { group } from "console";

export const LoginError: React.FC<{ message: string }> = ({ message }) => {
  const { loginWithRedirect, logout } = useAuth0();

  return (
    <div className={elements["center-wrapper"]}>
      <div className={elements["content"]}>
        <h3>Gi Effektivt.</h3>
        <h5>Gi Effektivt.</h5>

        <p>{message}</p>
      </div>

      <div className={elements["button-group"]}>
        <EffektButton
          onClick={() => logout({ returnTo: process.env.NEXT_PUBLIC_SITE_URL })}
          type={EffektButtonType.SECONDARY}
        >
          Avbryt
        </EffektButton>
        <EffektButton onClick={loginWithRedirect} cy="btn-login">
          Logg inn
        </EffektButton>
      </div>
    </div>
  );
};

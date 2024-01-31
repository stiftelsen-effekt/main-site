import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import elements from "./LoginError.module.scss";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";

export type LoginErrorConfig = {
  login_abort_label: string;
  login_button_label: string;
};

export const LoginError: React.FC<{
  message: string;
  siteTitle: string;
  loginErrorConfig: LoginErrorConfig;
}> = ({ message, siteTitle, loginErrorConfig }) => {
  const { loginWithRedirect, logout } = useAuth0();

  return (
    <div className={elements["center-wrapper"]}>
      <div className={elements["content"]}>
        <h3>{siteTitle}</h3>
        <h5>{siteTitle}</h5>
        <p>{message}</p>

        <div className={elements["button-group"]}>
          <EffektButton onClick={() => logout({ returnTo: process.env.NEXT_PUBLIC_SITE_URL })}>
            {loginErrorConfig.login_abort_label}
          </EffektButton>
          <EffektButton
            onClick={loginWithRedirect}
            cy="btn-login"
            variant={EffektButtonVariant.SECONDARY}
          >
            {loginErrorConfig.login_button_label}
          </EffektButton>
        </div>
      </div>
    </div>
  );
};

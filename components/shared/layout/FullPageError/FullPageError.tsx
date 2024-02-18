import React from "react";
import style from "./FullPageError.module.scss";
import { EffektButton } from "../../components/EffektButton/EffektButton";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

export const FullPageError: React.FC<{ error?: string }> = ({ error }) => {
  const { user, logout } = useAuth0();
  const router = useRouter();

  return (
    <div className={style.fullpagewrapper}>
      <h1>Noe gikk galt</h1>
      <p>{error}</p>
      <div className={style.buttons}>
        <EffektButton onClick={() => router.push("/")}>Ta meg tilbake til forsiden</EffektButton>
        {user && (
          <EffektButton onClick={() => logout({ returnTo: window.location.origin })}>
            Logg ut
          </EffektButton>
        )}
      </div>
    </div>
  );
};

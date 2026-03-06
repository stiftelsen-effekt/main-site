import React from "react";
import style from "./FullPageError.module.scss";
import { EffektButton } from "../../components/EffektButton/EffektButton";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

export const FullPageError: React.FC<{ error?: string; title?: string }> = ({
  error,
  title = "Noe gikk galt",
}) => {
  const { user, logout } = useAuth0();
  const router = useRouter();

  return (
    <div className={style.fullpagewrapper}>
      <h1>{title}</h1>
      {error ? <p>{error}</p> : null}
      <div className={style.buttons}>
        <EffektButton onClick={() => router.push("/")}>Ta meg tilbake til forsiden</EffektButton>
        {user && (
          <EffektButton
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Logg ut
          </EffektButton>
        )}
      </div>
    </div>
  );
};

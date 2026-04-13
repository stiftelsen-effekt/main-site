import React from "react";
import style from "./FullPageError.module.scss";
import { EffektButton } from "../../components/EffektButton/EffektButton";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import { useMainLocale } from "../../../../context/MainLocaleContext";

export const FullPageError: React.FC<{ error?: string; title?: string }> = ({ error, title }) => {
  const { user, logout } = useAuth0();
  const router = useRouter();
  const mainLocale = useMainLocale();

  const defaultTitle =
    mainLocale === "dk"
      ? "Noget gik galt"
      : mainLocale === "sv"
      ? "Något gick fel"
      : "Noe gikk galt";
  const backButtonLabel =
    mainLocale === "dk"
      ? "Tag mig tilbage til forsiden"
      : mainLocale === "sv"
      ? "Ta mig tillbaka till startsidan"
      : "Ta meg tilbake til forsiden";
  const logoutLabel = mainLocale === "dk" ? "Log ud" : mainLocale === "sv" ? "Logga ut" : "Logg ut";

  return (
    <div className={style.fullpagewrapper}>
      <h1>{title ?? defaultTitle}</h1>
      {error ? <p>{error}</p> : null}
      <div className={style.buttons}>
        <EffektButton onClick={() => router.push("/")}>{backButtonLabel}</EffektButton>
        {user && (
          <EffektButton
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            {logoutLabel}
          </EffektButton>
        )}
      </div>
    </div>
  );
};

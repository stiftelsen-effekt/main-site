import React from "react";
import { Spinner } from "./spinner";
import style from "../../styles/FullPageError.module.css";
import { EffektButton } from "./effektbutton";
import { useRouter } from "next/router";

export const FullPageError: React.FC = () => {
  const router = useRouter();

  return (
    <div className={style.fullpagewrapper}>
      <h1>Noe gikk galt</h1>
      <EffektButton onClick={() => router.push("/")}>Ta meg tilbake til forsiden</EffektButton>
    </div>
  );
};

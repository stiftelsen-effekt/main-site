import React from "react";
import { BlackTitle, InfoText } from "../FirstPane/MethodPane.style";
import { Pane } from "../Panes.style";
import { LinkWrapper } from "./ResultPane.style";

export const ResultPane: React.FC = () => {
  return (
    <Pane>
      <BlackTitle>
        Donasjonene dine er nå registert for skattefradrag
      </BlackTitle>
      <InfoText>
        {`Hvis du ønsker å se hvor mye du har donert hittil, gå til `}
        <a href="https://gieffektivt.no/historikk" rel="noreferrer" target="_blank">
          https://gieffektivt.no/historikk
        </a>
        {` og tast inn eposten din, så mottar du straks en oversikt over alle dine donasjoner.`}
        <br />
        <br />
        Takk for at du donerer gjennom gieffektivt.no!
      </InfoText>

      <LinkWrapper href="https://gieffektivt.no" rel="noreferrer">
        <button>Tilbake til forsiden</button>
      </LinkWrapper>
    </Pane>
  );
};

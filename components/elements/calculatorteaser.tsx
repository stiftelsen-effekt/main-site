import React from "react";
import { EffektButton } from "./effektbutton";
import elements from "../../styles/Elements.module.css";

export const CalculatorTeaser: React.FC = () => {
  return (
    <div className={elements.calculatorteaser}>
      <h2>Hvor mye har du til overs?</h2>
      <p>Se hvor mye du har råd til å gi <br/>med Rikdomskalkulatoren.</p>
      <EffektButton onClick={() => {}}>Les mer</EffektButton>
    </div>
  )
}
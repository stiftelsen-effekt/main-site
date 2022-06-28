import React from "react";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import elements from "./CalculatorTeaser.module.scss";

export const CalculatorTeaser: React.FC = () => {
  return (
    <div className={elements.calculatorteaser}>
      <h2>Hvor mye har du til overs?</h2>
      <p>
        Se hvor mye du har råd til å gi <br />
        med Rikdomskalkulatoren.
      </p>
      <EffektButton onClick={() => {}}>Les mer</EffektButton>
    </div>
  );
};

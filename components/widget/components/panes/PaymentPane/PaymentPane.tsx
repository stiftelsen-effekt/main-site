import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import { Pane } from "../Panes.style";
import { ResultPane } from "./Bank/ResultPane";
import { VippsPane } from "./Vipps/VippsPane";

export const PaymentPane: React.FC = () => {
  const method = useSelector((state: State) => state.donation.method);

  return (
    <Pane>
      {method === PaymentMethod.BANK && <ResultPane />}
      {method === PaymentMethod.VIPPS && <VippsPane />}
    </Pane>
  );
};

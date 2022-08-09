import actionCreatorFactory from "typescript-fsa";
import { RegisterPaymentData } from "../../types/Temp";

const actionCreator = actionCreatorFactory();

export const registerPaymentAction = actionCreator.async<
  RegisterPaymentData,
  boolean,
  Error
>("REGISTER_PAYMENT_FB");

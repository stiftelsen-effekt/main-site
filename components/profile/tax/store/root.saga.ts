import { all, takeLatest } from "redux-saga/effects";
import { registerPaymentAction } from "./paymentInfo/actions";
import { registerPaymentFB } from "./paymentInfo/saga";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function* watchAll() {
  yield all([
    takeLatest(registerPaymentAction.started.type, registerPaymentFB),
  ]);
}

export default watchAll;

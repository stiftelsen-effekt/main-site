import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { API_URL } from "../../config/api";
import { IServerResponse } from "../../types/Temp";
import { fetchCauseAreasAction } from "./actions";
import { CauseArea } from "../../types/CauseArea";

export function* fetchCauseAreas(action: Action<undefined>): SagaIterator<void> {
  try {
    const request = yield call(fetch, `${API_URL}/causeareas/active/`);
    const result: IServerResponse<CauseArea[]> = yield call(request.json.bind(request));
    if (result.status !== 200) throw new Error(result.content as string);

    yield put(
      fetchCauseAreasAction.done({
        params: action.payload,
        result: result.content as CauseArea[],
      }),
    );
  } catch (ex) {
    yield put(fetchCauseAreasAction.failed({ params: action.payload, error: ex as Error }));
  }
}

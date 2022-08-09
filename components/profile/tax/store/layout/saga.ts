import { SagaIterator } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { API_URL } from "../../config/api";
import { Organization } from "../../types/Organization";
import { IServerResponse } from "../../types/Temp";
import { fetchOrganizationsAction } from "./actions";

export function* fetchOrganizations(
  action: Action<undefined>
): SagaIterator<void> {
  try {
    const request = yield call(fetch, `${API_URL}/organizations/active/`);
    const result: IServerResponse<Organization[]> = yield call(
      request.json.bind(request)
    );
    if (result.status !== 200) throw new Error(result.content as string);

    yield put(
      fetchOrganizationsAction.done({
        params: action.payload,
        result: result.content as Organization[],
      })
    );
  } catch (ex) {
    yield put(
      fetchOrganizationsAction.failed({ params: action.payload, error: ex })
    );
  }
}

export function* getDonorByEmail(
  action: Action<undefined>
): SagaIterator<void> {
  try {
    const request = yield call(fetch, `${API_URL}/organizations/active/`);
    const result: IServerResponse<Organization[]> = yield call(
      request.json.bind(request)
    );
    if (result.status !== 200) throw new Error(result.content as string);

    yield put(
      fetchOrganizationsAction.done({
        params: action.payload,
        result: result.content as Organization[],
      })
    );
  } catch (ex) {
    yield put(
      fetchOrganizationsAction.failed({ params: action.payload, error: ex })
    );
  }
}

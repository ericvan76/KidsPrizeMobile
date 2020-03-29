import { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import * as actions from 'src/actions/auth';
import { fetchChildren, reset } from 'src/actions/child';
import { endRequesting, requestFailure, startRequesting } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { authClient } from 'src/api/authClient';

export function* signInSaga(action: typeof actions.signIn.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    const profile: Profile = yield call(authClient.signInAsync);
    yield all([
      put(actions.updateProfile(profile)),
      put(endRequesting(actionType))
    ]);
    yield put(fetchChildren(undefined));
  } catch (error) {
    yield all([
      put(requestFailure({ actionType, error })),
    ]);
  }
}

function* signOutSaga(action: typeof actions.signOut.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    yield call(authClient.signOutAsync);
  } catch (error) {
    // do nothing
  }
  yield all([
    put(actions.updateProfile(undefined)),
    put(reset(undefined)),
    put(endRequesting(actionType))
  ]);
}

export function* authSaga(): SagaIterator {
  yield takeEvery(actions.signIn.type, signInSaga);
  yield takeEvery(actions.signOut.type, signOutSaga);
}

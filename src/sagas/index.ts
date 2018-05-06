import { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { childSaga } from './child';

export function* rootSaga(): SagaIterator {
  yield all([
    fork(authSaga),
    fork(childSaga)]
  );
}

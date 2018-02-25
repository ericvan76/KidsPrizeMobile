import { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { childSaga } from './child';

export function* rootSaga(): SagaIterator {
  yield fork(authSaga);
  yield fork(childSaga);
}

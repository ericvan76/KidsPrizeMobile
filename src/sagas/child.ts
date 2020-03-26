import moment from 'moment';
import { SagaIterator } from 'redux-saga';
import { all, call, Effect, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from 'src/actions/child';
import { endRequesting, requestFailure, startRequesting } from 'src/actions/requestState';
import { authClient } from 'src/api/authClient';
import {
  Child,
  ChildId,
  createChildAsync,
  createRedeemAsync,
  deleteChildAsync,
  getChildrenListAsync,
  getRedeemsAsync,
  getScoresAsync,
  Redeem,
  ScoreResult,
  setScoreAsync,
  updateChildAsync
} from 'src/api/child';
import { DATE_FORMAT, REDEEMS_PAGE_SIZE, WEEKS_PAGE_SIZE } from 'src/constants';
import { AppState, ChildState } from 'src/store';

function* fetchChildrenSaga(action: typeof actions.fetchChildren.shape): SagaIterator {
  const actionType = action.type;
  const requestState = yield select((s: AppState) => s.requestState.requesting[actionType]);
  if (requestState) {
    return;
  }
  try {
    yield put(startRequesting(actionType));
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const children: Child[] = yield call(getChildrenListAsync, authToken);
    const effects: Effect[] = [];
    if (children.length > 0) {
      children.forEach((c: Child) => {
        effects.push(put(actions.updateChild(c)));
      });
      effects.push(put(actions.switchChild(children[0].id)));
    }
    effects.push(put(endRequesting(actionType)));
    yield all(effects);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* createChildSaga(action: typeof actions.createChild.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    const payload = action.payload;
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const result: ScoreResult = yield call(createChildAsync, authToken, payload.childId, payload.name, payload.gender, payload.tasks);
    yield all([
      put(actions.updateScores(result)),
      put(actions.switchChild(result.child.id)),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* modifyChildSaga(action: typeof actions.modifyChild.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    const payload = action.payload;
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const result: ScoreResult = yield call(updateChildAsync, authToken, payload.childId, payload.name, payload.gender, payload.tasks);
    yield all([
      put(actions.updateScores(result)),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* deleteChildSaga(action: typeof actions.deleteChild.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    const childId = action.payload;
    const allChildren: Record<ChildId, ChildState> = yield select((s: AppState) => s.children);
    const nextChildId = Object
      .keys(allChildren)
      .find((k: ChildId) => k !== childId) || null;
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    yield call(deleteChildAsync, authToken, childId);
    yield all([
      put(actions.switchChild(nextChildId)),
      put(actions.removeChild(childId)),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* setScoreSaga(action: typeof actions.setScore.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    const payload = action.payload;
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    yield call(setScoreAsync, authToken, payload.childId, payload.date, payload.task, payload.value);
    const childState: ChildState = yield select((s: AppState) => s.children[payload.childId]);
    const child = { ...childState.child, totalScore: childState.child.totalScore + (payload.value > 0 ? 1 : -1) };
    yield all([
      put(actions.updateChild(child)),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* refreshScoresSaga(action: typeof actions.refreshScores.shape): SagaIterator {
  const actionType = action.type;
  const requestState = yield select((s: AppState) => s.requestState.requesting[actionType]);
  if (requestState) {
    return;
  }
  try {
    yield put(startRequesting(actionType));
    const childId = action.payload;
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const rewindFrom: string = moment()
      .day(7)
      .format(DATE_FORMAT);
    const result = yield call(getScoresAsync, authToken, childId, rewindFrom, WEEKS_PAGE_SIZE);
    yield all([
      put(actions.updateScores(result)),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* fetchMoreScoresSaga(action: typeof actions.fetchMoreStores.shape): SagaIterator {
  const actionType = action.type;
  const requestState = yield select((s: AppState) => s.requestState.requesting[actionType]);
  if (requestState) {
    return;
  }
  try {
    yield put(startRequesting(actionType));
    const childId = action.payload;
    const childState: ChildState = yield select((s: AppState) => s.children[childId]);
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const loadedWeeks = childState.scores !== undefined
      ? Object
        .keys(childState.scores)
        .sort()
      : [];
    if (loadedWeeks.length > 0) {
      if (loadedWeeks.length < WEEKS_PAGE_SIZE) {
        // less than one page
        yield put(endRequesting(actionType));
      } else {
        const lastWeek = loadedWeeks[0];
        const result = yield call(getScoresAsync, authToken, childId, lastWeek, WEEKS_PAGE_SIZE);
        yield all([
          put(actions.updateScores(result)),
          put(endRequesting(actionType))
        ]);
      }
    } else {
      yield all([
        put(actions.refreshScores(childId)),
        put(endRequesting(actionType))
      ]);
    }
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* createRedeemSaga(action: typeof actions.createRedeem.shape): SagaIterator {
  const actionType = action.type;
  try {
    yield put(startRequesting(actionType));
    const redeem = action.payload;
    const childId = redeem.childId;
    const childState: ChildState = yield select((s: AppState) => s.children[childId]);
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const newRedeem: Redeem = yield call(createRedeemAsync, authToken, redeem.childId, redeem.description, redeem.value);
    const child: Child = {
      ...childState.child,
      totalScore: childState.child.totalScore - newRedeem.value
    };
    yield all([
      put(actions.updateRedeems({ child, redeems: [newRedeem] })),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* refreshRedeemsSaga(action: typeof actions.refreshRedeems.shape): SagaIterator {
  const actionType = action.type;
  const requestState = yield select((s: AppState) => s.requestState.requesting[actionType]);
  if (requestState) {
    return;
  }
  try {
    yield put(startRequesting(actionType));
    const childId = action.payload;
    const childState: ChildState = yield select((s: AppState) => s.children[childId]);
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const redeems: Redeem[] = yield call(getRedeemsAsync, authToken, childId, 0, REDEEMS_PAGE_SIZE);
    yield all([
      put(actions.updateRedeems({ child: childState.child, redeems })),
      put(endRequesting(actionType))
    ]);
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

function* fetchMoreRedeemsSaga(action: typeof actions.fetchMoreRedeems.shape): SagaIterator {
  const actionType = action.type;
  const requestState = yield select((s: AppState) => s.requestState.requesting[actionType]);
  if (requestState) {
    return;
  }
  try {
    yield put(startRequesting(actionType));
    const childId = action.payload;
    const childState = yield select((s: AppState) => s.children[childId]);
    const authToken: string = yield call(authClient.getAuthTokenAsync);
    const offset = childState.redeems !== undefined ? Object.keys(childState.redeems).length : 0;
    if (offset < REDEEMS_PAGE_SIZE) {
      // less than one page
      yield put(endRequesting(actionType));
    } else {
      const redeems: Redeem[] = yield call(getRedeemsAsync, authToken, childId, offset, REDEEMS_PAGE_SIZE);
      yield all([
        put(actions.updateRedeems({ child: childState.child, redeems })),
        put(endRequesting(actionType))
      ]);
    }
  } catch (error) {
    yield put(requestFailure({ actionType, error }));
  }
}

export function* childSaga(): SagaIterator {
  yield takeEvery(actions.fetchChildren.type, fetchChildrenSaga);
  yield takeEvery(actions.refreshScores.type, refreshScoresSaga);
  yield takeEvery(actions.fetchMoreStores.type, fetchMoreScoresSaga);
  yield takeEvery(actions.refreshRedeems.type, refreshRedeemsSaga);
  yield takeEvery(actions.fetchMoreRedeems.type, fetchMoreRedeemsSaga);
  yield takeEvery(actions.createChild.type, createChildSaga);
  yield takeEvery(actions.modifyChild.type, modifyChildSaga);
  yield takeEvery(actions.deleteChild.type, deleteChildSaga);
  yield takeEvery(actions.setScore.type, setScoreSaga);
  yield takeEvery(actions.createRedeem.type, createRedeemSaga);
}

/* @flow */

import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import authReducer from '../reducers/auth';
import currentChildReducer from '../reducers/currentChild';
import childReducer from '../reducers/child';
import { failure } from '../actions/failure';
import { INITIAL_STATE } from '../reducers/initialState';

import type { Store, Middleware } from 'redux';
import type { AppState } from '../types/states.flow';
import type { Action } from '../types/actions.flow';

const failureMiddleware: Middleware<AppState, Action<any, any>> = store => next => (action: Action<any, any>): Dispatch<Action<any, any>> => {
  try {
    return next(action);
  } catch (err) {
    store.dispatch(failure(err));
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  currentChild: currentChildReducer,
  children: childReducer,
  form: formReducer
});

const store: Store<AppState, Action<any, any>> = createStore(rootReducer, INITIAL_STATE, applyMiddleware(thunk, failureMiddleware));

export default store;

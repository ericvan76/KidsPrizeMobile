/* @flow */

import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import authReducer from '../reducers/auth';
import currentChildReducer from '../reducers/currentChild';
import childReducer from '../reducers/child';
import failureReducer from '../reducers/failure';
import { INITIAL_STATE } from '../reducers/initialState';

import type { Store } from 'redux';
import type { AppState } from '../types/states.flow';
import type { Action } from '../types/actions.flow';


const rootReducer = combineReducers({
  auth: authReducer,
  currentChild: currentChildReducer,
  children: childReducer,
  form: formReducer,
  errors: failureReducer
});

const store: Store<AppState, Action<any, any>> = createStore(rootReducer, INITIAL_STATE, applyMiddleware(thunk));

export default store;

/* @flow */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers/';
import { INITIAL_STATE } from './reducers/initialState';

import type { Store } from 'redux';
import type { AppState } from './types/states.flow';
import type { Action } from './types/actions.flow';

const store: Store<AppState, Function | Action<any, any>> = createStore(rootReducer, INITIAL_STATE, applyMiddleware(thunk));

export default store;

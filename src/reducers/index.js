/* @flow */

import { combineReducers } from 'redux';

import authReducer from '../reducers/auth';
import currentChildReducer from '../reducers/currentChild';
import childReducer from '../reducers/child';
import failureReducer from '../reducers/failure';

const rootReducer = combineReducers({
  auth: authReducer,
  currentChild: currentChildReducer,
  children: childReducer,
  errors: failureReducer
});

export default rootReducer;
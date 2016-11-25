/* @flow */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from '../reducers/auth';
import currentChildReducer from '../reducers/currentChild';
import childReducer from '../reducers/child';
import failureReducer from '../reducers/failure';

const rootReducer = combineReducers({
  auth: authReducer,
  currentChild: currentChildReducer,
  children: childReducer,
  form: formReducer,
  errors: failureReducer
});

export default rootReducer;
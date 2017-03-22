import { combineReducers } from 'redux';

import { AppState } from '../types/states';
import auth from './auth';
import children from './children';
import errors from './errors';
import initialised from './initialised';

const rootReducer = combineReducers<AppState>({
  auth,
  initialised,
  children,
  errors
});

export default rootReducer;

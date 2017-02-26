import { combineReducers } from 'redux';

import { AppState } from '../types/states';
import authReducer from './auth';
import childReducer from './child';
import failureReducer from './failure';

const rootReducer = combineReducers<AppState>({
  auth: authReducer,
  children: childReducer,
  errors: failureReducer
});

export default rootReducer;

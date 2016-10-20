import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import auth from './reducers/auth';
import user from './reducers/user';
import currentChildId from './reducers/currentChildId';
import children from './reducers/children';
import scores from './reducers/scores';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: auth,
  user: user,
  currentChildId: currentChildId,
  children: children,
  scores: scores,
  form: formReducer
});

export default createStore(rootReducer, {}, applyMiddleware(thunk));
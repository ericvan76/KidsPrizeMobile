import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import authReducer from './auth';
import currentChildIdReducer from './currentChildId';
import childrenReducer from './children';
import scoresReducer from './scores';


const rootReducer = combineReducers({
  auth: authReducer,
  currentChildId: currentChildIdReducer,
  children: childrenReducer,
  scores: scoresReducer,
  form: formReducer
});

export default createStore(rootReducer, {}, applyMiddleware(thunk));

import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import user from './user';
import children from './children';

const rootReducer = combineReducers({user, children});

export default(preloadedState) => {
  return createStore(rootReducer, preloadedState, applyMiddleware(thunk));
}

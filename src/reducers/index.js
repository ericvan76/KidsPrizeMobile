import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import user from './user';
import currentChildId from './currentChildId';
import children from './children';
import scores from './scores';

const rootReducer = combineReducers({user: user, currentChildId: currentChildId, children: children, scores: scores});

const configureStore = () => {
  return createStore(rootReducer, {}, applyMiddleware(thunk));
};

export default configureStore;

import {combineReducers} from 'redux';
import user from './user';
import children from './children';

const rootReducer = combineReducers({user, children});

export default rootReducer;

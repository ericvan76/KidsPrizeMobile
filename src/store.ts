
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import { INITIAL_STATE } from './reducers/initialState';
import { AppState } from './types/states';

const store = createStore<AppState>(rootReducer, INITIAL_STATE, applyMiddleware(thunk));

export default store;

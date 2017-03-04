
import { applyMiddleware, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import { INITIAL_STATE } from './reducers/initialState';
import { AppState } from './types/states';

const store = createStore<AppState>(enableBatching(rootReducer), INITIAL_STATE, applyMiddleware(thunk));

export default store;

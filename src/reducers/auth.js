/* @flow */

import update from 'react-addons-update';
import { INITIALISED, SET_TOKEN, CLEAR_TOKEN, SET_USER } from '../actions/auth';
import { INITIAL_STATE } from './initialState';

import type { AuthState } from '../types/states.flow';
import type { Action, InitialisedPayload } from '../types/actions.flow';

export default function reducer(state: AuthState = INITIAL_STATE.auth, action: Action<any, any>): AuthState {

  switch (action.type) {
    case INITIALISED:
      {
        const payload: InitialisedPayload = action.payload;
        return update(state, {
          initialised: { $set: true },
          discovery: { $set: payload.discovery },
          token: { $set: payload.token }
        });
      }
    case SET_TOKEN:
      {
        const token: Token = action.payload;
        return update(state, {
          token: { $set: token }
        });
      }
    case CLEAR_TOKEN:
      {
        return update(state, {
          token: { $set: null },
          user: { $set: null }
        });
      }
    case SET_USER:
      {
        const user: User = action.payload;
        return update(state, {
          user: { $set: user }
        });
      }
    default:
      return state;
  }
}
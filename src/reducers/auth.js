/* @flow */

import update from 'react-addons-update';
import { INITIALISED, UPDATE_TOKEN, CLEAR_TOKEN, SET_PROFILE } from '../actions/auth';
import { INITIAL_STATE } from './initialState';

import type { AuthState } from '../types/states.flow';
import type { Action, InitialisedPayload } from '../types/actions.flow';
import type { Token, Profile } from '../types/auth.flow';

export default function reducer(state: AuthState = INITIAL_STATE.auth, action: Action<any, any>): AuthState {

  switch (action.type) {
    case INITIALISED:
      {
        const payload: InitialisedPayload = action.payload;
        return update(state, {
          initialised: { $set: true },
          token: { $set: payload.token }
        });
      }
    case UPDATE_TOKEN:
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
          profile: { $set: null }
        });
      }
    case SET_PROFILE:
      {
        const profile: Profile = action.payload;
        return update(state, {
          profile: { $set: profile }
        });
      }
    default:
      return state;
  }
}
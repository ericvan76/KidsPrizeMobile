/* @flow */

import update from 'react-addons-update';
import { INITIALISED, UPDATE_TOKEN, CLEAR_TOKEN } from '../actions/auth';
import { INITIAL_STATE } from './initialState';
import * as auth0 from '../api/auth0';

import type { AuthState } from '../types/states.flow';
import type { Action, InitialisedPayload } from '../types/actions.flow';
import type { Token } from '../types/auth.flow';

export default function reducer(state: AuthState = INITIAL_STATE.auth, action: Action<any, any>): AuthState {

  switch (action.type) {
    case INITIALISED:
      {
        const payload: InitialisedPayload = action.payload;
        return update(state, {
          initialised: { $set: true },
          token: { $set: payload.token },
          profile: { $set: payload.token ? auth0.decodeJwt(payload.token.id_token) : null }
        });
      }
    case UPDATE_TOKEN:
      {
        const token: Token = action.payload;
        return update(state, {
          token: { $set: token },
          profile: { $set: auth0.decodeJwt(token.id_token) }
        });
      }
    case CLEAR_TOKEN:
      {
        return update(state, {
          token: { $set: null },
          profile: { $set: null }
        });
      }
    default:
      return state;
  }
}
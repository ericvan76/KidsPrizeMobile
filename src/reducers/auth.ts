import {
  CLEAR_TOKEN,
  ClearTokenAction,
  TOKEN_LOADED,
  TokenLoadedAction,
  UPDATE_TOKEN,
  UpdateTokenAction
} from '../actions/auth';

import * as auth0 from '../api/auth0';
import { Token } from '../types/auth';
import { AuthState } from '../types/states';
import { INITIAL_STATE } from './initialState';

export default function reducer(
  state: AuthState = INITIAL_STATE.auth,
  action: TokenLoadedAction | UpdateTokenAction | ClearTokenAction): AuthState {

  switch (action.type) {
    case TOKEN_LOADED:
      {
        const payload = action.payload as Token | undefined;
        return {
          ...state,
          tokenLoaded: true,
          token: payload,
          profile: payload ? auth0.decodeJwt(payload.id_token) : undefined
        };
      }
    case UPDATE_TOKEN:
      {
        const token = action.payload as Token;
        return {
          ...state,
          token,
          profile: auth0.decodeJwt(token.id_token)
        };
      }
    case CLEAR_TOKEN:
      {
        return {
          ...state,
          token: undefined,
          profile: undefined
        };
      }
    default:
      return state;
  }
}

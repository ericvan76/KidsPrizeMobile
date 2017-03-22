import * as auth0 from '../api/auth0';
import * as storage from '../api/storage';
import { Action, AsyncAction } from '../types/actions';
import { Token } from '../types/auth';
import { raiseError } from './errors';

export const TOKEN_LOAD_COMPLETED = 'TOKEN_LOAD_COMPLETED';
export type TokenLoadCompletedAction = Action<typeof TOKEN_LOAD_COMPLETED, Token | undefined>;
export function tokenLoadCompleted(token?: Token): TokenLoadCompletedAction {
  return {
    type: TOKEN_LOAD_COMPLETED,
    payload: token
  };
}

export const UPDATE_TOKEN = 'UPDATE_TOKEN';
export type UpdateTokenAction = Action<typeof UPDATE_TOKEN, Token>;
export function updateToken(token: Token): UpdateTokenAction {
  return {
    type: UPDATE_TOKEN,
    payload: token
  };
}

export const CLEAR_TOKEN = 'CLEAR_TOKEN';
export type ClearTokenAction = Action<typeof CLEAR_TOKEN, void>;
export function clearToken(): ClearTokenAction {
  return {
    type: CLEAR_TOKEN,
    payload: undefined
  };
}

// Async actions

export function loadTokenAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      const token = await storage.loadToken();
      if (token && token.id_token) {
        const decoded = auth0.decodeJwt(token.id_token);
        if (decoded.email && decoded.email_verified) {
          dispatch(tokenLoadCompleted(token));
          return;
        }
      }
      dispatch(tokenLoadCompleted());
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function saveTokenAsync(token: Token): AsyncAction {
  return async (dispatch) => {
    try {
      await storage.saveToken(token);
      dispatch(updateToken(token));
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function clearTokenAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      await storage.clearToken();
      dispatch(clearToken());
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function logoutAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      await storage.clearToken();
      await auth0.logout();
      dispatch(clearToken());
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

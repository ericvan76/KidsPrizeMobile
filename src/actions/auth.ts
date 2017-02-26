
import * as auth0 from '../api/auth0';
import * as storage from '../api/storage';
import { Action, AsyncAction } from '../types/actions';
import { Token } from '../types/auth';
import { failure } from './failure';

export const TOKEN_LOADED = 'TOKEN_LOADED';
export type TokenLoadedAction = Action<typeof TOKEN_LOADED, Token | undefined>;
export function tokenLoaded(token?: Token): TokenLoadedAction {
  return {
    type: TOKEN_LOADED,
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
          dispatch(tokenLoaded(token));
          return;
        }
      }
      dispatch(tokenLoaded());
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function saveTokenAsync(token: Token): AsyncAction {
  return async (dispatch) => {
    try {
      await storage.saveToken(token);
      dispatch(updateToken(token));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function clearTokenAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      await storage.clearToken();
      dispatch(clearToken());
    } catch (err) {
      dispatch(failure(err));
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
      dispatch(failure(err));
    }
  };
}

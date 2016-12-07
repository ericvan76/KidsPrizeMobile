/* @flow */
import CookieManager from 'react-native-cookies';

import * as auth0 from '../api/auth0';
import * as storage from '../api/storage';
import { failure } from './failure';

import type { Token } from '../types/auth.flow';
import type { Action, InitialisedPayload } from '../types/actions.flow';

export const INITIALISED: string = 'INITIALISED';
export const UPDATE_TOKEN: string = 'UPDATE_TOKEN';
export const CLEAR_TOKEN: string = 'CLEAR_TOKEN';

export function initialised(token: ?Token): Action<'INITIALISED', InitialisedPayload> {
  return {
    type: 'INITIALISED',
    payload: { token: token }
  };
}

export function updateToken(token: Token): Action<'UPDATE_TOKEN', Token> {
  return {
    type: 'UPDATE_TOKEN',
    payload: token
  };
}

export function clearToken(): Action<'CLEAR_TOKEN', void> {
  return {
    type: 'CLEAR_TOKEN',
    payload: undefined
  };
}

// Async actions

export function initialiseAsync() {
  return async (dispatch: Dispatch) => {
    try {
      const token = await storage.loadToken();
      if (token && token.id_token) {
        const decoded = auth0.decodeJwt(token.id_token);
        if (decoded.email && decoded.email_verified) {
          dispatch(initialised(token));
          return;
        }
      }
      dispatch(initialised(null));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function saveTokenAsync(token: Token) {
  return async (dispatch: Dispatch) => {
    try {
      await storage.saveToken(token);
      dispatch(updateToken(token));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function clearTokenAsync() {
  return async (dispatch: Dispatch) => {
    try {
      await storage.clearToken();
      dispatch(clearToken());
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function logoutAsync() {
  return async (dispatch: Dispatch) => {
    try {
      await storage.clearToken();
      await CookieManager.clearAll(() => { });
      await auth0.logout();
      dispatch(clearToken());
    } catch (err) {
      dispatch(failure(err));
    }
  };
}


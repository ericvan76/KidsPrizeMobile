/* @flow */

import oidc from '../api/oidc';
import * as storage from '../api/storage';
import * as api from '../api/mock';


export const DISCOVERY_SUCCESS: string = 'DISCOVERY_SUCCESS';
export const TOKEN_SUCCESS: string = 'TOKEN_SUCCESS';
export const TOKEN_REVOKED: string = 'TOKEN_REVOKED';
export const USER_INFO: string = 'USER_INFO';


export function discovery() {
  return async (dispatch: Dispatch) => {
    const discovery = await oidc.discover();
    dispatch({
      type: DISCOVERY_SUCCESS,
      payload: discovery
    });
  };
}

export function loadToken() {
  return async (dispatch: Dispatch) => {
    const token = await storage.loadToken();
    dispatch({
      type: TOKEN_SUCCESS,
      payload: token
    });
  };
}

export function requestToken(code: string) {
  return async (dispatch: Dispatch) => {
    const token = await oidc.requestToken(code);
    await storage.saveToken(token);
    dispatch({
      type: TOKEN_SUCCESS,
      payload: token
    });
  };
}

export function logout() {
  return async (dispatch: Function, getState: Dispatch) => {
    const state = getState();
    await storage.clearToken();
    await oidc.logout(state.auth.token);
    dispatch({
      type: TOKEN_REVOKED
    });
  };
}

export function getUserInfo() {
  return async (dispatch: Dispatch) => {
    const user = await api.getUserInfo();
    dispatch({
      type: USER_INFO,
      payload: user
    });
  };
}
/* @flow */

import oidc from '../api/oidc';
import * as api from '../api/api';
import * as storage from '../api/storage';

import type { AppState } from '../types/states.flow';
import type { Action, InitialisedPayload } from '../types/actions.flow';

export const INITIALISED: string = 'INITIALISED';
export const SET_TOKEN: string = 'SET_TOKEN';
export const CLEAR_TOKEN: string = 'CLEAR_TOKEN';
export const SET_USER: string = 'SET_USER';


export function initialised(discovery: Discovery, token: ?Token): Action<'INITIALISED', InitialisedPayload> {
  return {
    type: 'INITIALISED',
    payload: { discovery: discovery, token: token }
  };
}

export function setToken(token: Token): Action<'SET_TOKEN', Token> {
  return {
    type: 'SET_TOKEN',
    payload: token
  };
}

export function clearToken(): Action<'CLEAR_TOKEN', void> {
  return {
    type: 'CLEAR_TOKEN',
    payload: undefined
  };
}

export function setUser(user: User) {
  return {
    type: 'SET_USER',
    payload: user
  };
}

// Async actions

export function initialiseAsync() {
  return async (dispatch: Dispatch) => {
    const discovery = await oidc.discover();
    const token = await storage.loadToken();
    dispatch(initialised(discovery, token));
  };
}

export function requestTokenAsync(code: string) {
  return async (dispatch: Dispatch) => {
    const token = await oidc.requestToken(code);
    await storage.saveToken(token);
    dispatch(setToken(token));
  };
}


export function logoutAsync() {
  return async (dispatch: Dispatch, getState: Function) => {
    const state: AppState = getState();
    if (state.auth.token) {
      const token: Token = state.auth.token;
      await storage.clearToken();
      await oidc.logout(token);
      dispatch(clearToken());
    }
  };
}

export function getUserInfoAsync() {
  return async (dispatch: Dispatch) => {
    // set current timezone before get user
    await api.setPreference({
      timeZoneOffset: new Date().getTimezoneOffset()
    });
    const user = await oidc.getUserInfo();
    dispatch(setUser(user));
  };
}
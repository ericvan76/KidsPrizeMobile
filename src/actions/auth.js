/* @flow */

import * as auth0 from '../api/auth0';
import * as api from '../api/api';
import * as storage from '../api/storage';
import { failure } from './failure';

import type { Token, Profile } from '../types/auth.flow';
import type { AppState } from '../types/states.flow';
import type { Action, InitialisedPayload } from '../types/actions.flow';

export const INITIALISED: string = 'INITIALISED';
export const UPDATE_TOKEN: string = 'UPDATE_TOKEN';
export const CLEAR_TOKEN: string = 'CLEAR_TOKEN';
export const SET_PROFILE: string = 'SET_PROFILE';

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

export function setProfile(profile: Profile) {
  return {
    type: 'SET_PROFILE',
    payload: profile
  };
}

// Async actions

export function initialiseAsync() {
  return async (dispatch: Dispatch) => {
    try {
      const token = await storage.loadToken();
      dispatch(initialised(token));
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

export function getUserProfileAsync() {
  return async (dispatch: Dispatch) => {
    try {
      // set current timezone before get user
      await api.setPreference({
        timeZoneOffset: new Date().getTimezoneOffset()
      });
      const profile = await auth0.getUserProfile();
      dispatch(setProfile(profile));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function logoutAsync() {
  return async (dispatch: Dispatch) => {
    try {
      await auth0.logout();
      await storage.clearToken();
      dispatch(clearToken());
    } catch (err) {
      dispatch(failure(err));
    }
  };
}


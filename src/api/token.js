/* @flow */

import moment from 'moment';
import store from '../store';
import { setToken, clearToken } from '../actions/auth';
import oidc from './oidc';
import * as storage from './storage';
import type { AppState } from '../types/states.flow';

export async function getAccessToken(): Promise<string> {
  try {
    const state: AppState = store.getState();
    if (state.auth.token) {
      const token = state.auth.token;
      if (moment(Date.now()).add(5, 'minutes').isAfter(token.expires_at)) {
        if (token.refresh_token) {
          const newToken = await oidc.refreshToken(token.refresh_token);
          await storage.saveToken(newToken);
          store.dispatch(setToken(newToken));
          return newToken.access_token;
        }
      } else {
        return token.access_token;
      }
    }
  } catch (err) {
    // do nothing
  }
  await storage.clearToken();
  store.dispatch(clearToken());
  throw new Error('Failed to get access_token.');
}
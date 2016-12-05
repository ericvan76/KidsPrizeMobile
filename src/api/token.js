/* @flow */

import moment from 'moment';
import store from '../store';
import { saveTokenAsync, clearTokenAsync } from '../actions/auth';
import * as auth0 from './auth0';

import type { AppState } from '../types/states.flow';
import type { Token } from '../types/auth.flow';

export async function getBearerToken(): Promise<string> {
  try {
    const state: AppState = store.getState();
    if (state.auth.token && state.auth.token.id_token) {
      const token = state.auth.token;
      if (moment(Date.now()).add(5, 'minutes').isAfter(token.expires_at)) {
        if (token.refresh_token) {
          const delegation: Token = await auth0.obtainDelegationToken(token.refresh_token);
          store.dispatch(saveTokenAsync(delegation));
          return delegation.id_token;
        }
      } else {
        return token.id_token;
      }
    }
  } catch (err) {
    // do nothing
  }
  store.dispatch(clearTokenAsync());
  throw new Error('Failed to get bearer token.');
}
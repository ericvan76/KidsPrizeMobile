import moment from 'moment';

import * as actions from '../actions/auth';
import store from '../store';
import { Token } from '../types/auth';
import { AppState } from '../types/states';
import * as auth0 from './auth0';

export async function getBearerToken(): Promise<string> {
  try {
    const state: AppState = store.getState();
    if (state.auth.token && state.auth.token.id_token) {
      const token = state.auth.token;
      const decoded = auth0.decodeJwt(token.id_token);
      if (moment().add(5, 'minutes').isAfter(moment(decoded.exp * 1000))) {
        if (token.refresh_token) {
          const delegation: Token = await auth0.obtainDelegationToken(token.refresh_token);
          store.dispatch(actions.saveTokenAsync(delegation));
          return delegation.id_token;
        }
      } else {
        return token.id_token;
      }
    }
  } catch (err) {
    // do nothings
  }
  store.dispatch(actions.clearTokenAsync());
  throw new Error('Something went wrong with the auth token, please re-login.');
}

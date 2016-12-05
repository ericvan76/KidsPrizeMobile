/* @flow */

import moment from 'moment';
import config from '../__config__';
import { getBearerToken } from './token';
import * as url from '../utils/url';

import { fetchOrThrow } from './api';

import type { Token, Profile } from '../types/auth.flow';

export async function obtainDelegationToken(refresh_token: string): Promise<Token> {
  const token: Token = await fetchOrThrow(`https://${config.auth.auth0_domain}/delegation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: url.encodeQueryString({
      client_id: config.auth.client_id,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      refresh_token: refresh_token,
      target: config.auth.client_id,
      scope: 'openid profile'
    })
  });
  if (token.id_token) {
    token['refresh_token'] = refresh_token;
    token['expires_at'] = moment(Date.now()).add(token.expires_in, 'seconds').toDate();
    return token;
  } else {
    throw new Error('Failed to obtain delegation token.');
  }
}

export async function getUserProfile(): Promise<Profile> {
  // jwt
  const access_token = await getBearerToken();
  const profile = await fetchOrThrow(`https://${config.auth.auth0_domain}/tokeninfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: url.encodeQueryString({
      id_token: access_token
    })
  });
  return profile;
}

export async function logout() {
  return await fetch(`https://${config.auth.auth0_domain}/v2/logout?client_id=${config.auth.client_id}`);
}

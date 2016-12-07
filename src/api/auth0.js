/* @flow */

import jwtDecode from 'jwt-decode';
import config from '../__config__';
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
      scope: 'openid profile email email_verified'
    })
  });
  if (token.id_token) {
    token['refresh_token'] = refresh_token;
    return token;
  } else {
    throw new Error('Failed to obtain delegation token.');
  }
}

export function decodeJwt(id_token: string): Profile {
  var decoded = jwtDecode(id_token);
  return decoded;
}

export async function logout() {
  return await fetch(`https://${config.auth.auth0_domain}/v2/logout?federated`);
}

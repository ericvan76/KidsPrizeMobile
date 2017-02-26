import jwtDecode from 'jwt-decode';

import config from '../__config__';
import { Profile, Token } from '../types/auth';
import * as url from '../utils/url';
import { fetchOrThrow } from './api';

export async function obtainDelegationToken(refreshToken: string): Promise<Token> {
  const token: Token = await fetchOrThrow(`https://${config.auth.auth0_domain}/delegation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: url.encodeQueryString({
      client_id: config.auth.client_id,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      refresh_token: refreshToken,
      target: config.auth.client_id,
      scope: 'openid profile email email_verified'
    })
  });
  if (token.id_token) {
    token.refresh_token = refreshToken;
    return token;
  } else {
    throw new Error('Failed to obtain delegation token.');
  }
}

export function decodeJwt(idToken: string): Profile {
  return jwtDecode(idToken) as Profile;
}

export async function logout() {
  return await fetch(`https://${config.auth.auth0_domain}/v2/logout?federated`);
}

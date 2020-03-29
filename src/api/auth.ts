import { AuthSession } from 'expo';
import jwtDecode from 'jwt-decode';
import { CONFIG } from 'src/config';
import * as url from 'src/utils/url';

export interface Token {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

export interface Profile {
  email: string;
  email_verified: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  iat: number;
}

export async function authorizeAsync(): Promise<string> {

  const result = await AuthSession.startAsync(
    {
      authUrl:
        `https://${CONFIG.auth0Domain}/authorize?${url.toQueryString({
          client_id: CONFIG.auth0ClientId,
          response_type: 'code',
          scope: 'openid profile email email_verified offline_access',
          redirect_uri: AuthSession.getRedirectUrl()
        })}`
    });
  switch (result.type) {
    case 'success':
      return result.params.code;
    case 'error':
      throw new Error(`Error code: ${result.errorCode}`);
    case 'cancel':
    case 'dismiss':
    default:
      throw new Error('Authentication cancelled');
  }
}

export async function obtainTokenAsync(code: string): Promise<Token> {
  const req = new Request(
    `https://${CONFIG.auth0Domain}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CONFIG.auth0ClientId,
        client_secret: CONFIG.auth0ClientSecret,
        code: code,
        redirect_uri: AuthSession.getRedirectUrl()
      })
    }
  );
  const response = await fetch(req);
  if (!response.ok) {
    throw new Error('Obtain Token Failure.');
  }
  return await response.json() as Token;
}

export async function refreshTokenAsync(refreshToken: string): Promise<Token> {
  const req = new Request(
    `https://${CONFIG.auth0Domain}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: CONFIG.auth0ClientId,
        client_secret: CONFIG.auth0ClientSecret,
        refresh_token: refreshToken
      })
    }
  );
  const response = await fetch(req);
  if (!response.ok) {
    throw new Error('Refresh Token Failure.');
  }
  return await response.json() as Token;
}

export async function revokeRefreshTokenAsync(refreshToken: string): Promise<void> {
  const req = new Request(
    `https://${CONFIG.auth0Domain}/oauth/revoke`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: CONFIG.auth0ClientId,
        client_secret: CONFIG.auth0ClientSecret,
        token: refreshToken
      })
    }
  );
  const response = await fetch(req);
  if (!response.ok) {
    throw new Error('Revoke Token Failure.');
  }
}

export async function logoutAsync(): Promise<void> {
  const qs = url.toQueryString({
    client_id: CONFIG.auth0ClientId,
    federated: 'true'
  });
  await fetch(`https://${CONFIG.auth0Domain}/v2/logout?${qs}`);
}

export function decodeJwt(idToken: string): Profile {
  return jwtDecode(idToken);
}

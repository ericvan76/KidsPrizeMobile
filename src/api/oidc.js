/* @flow */

import moment from 'moment';
import config from '../__config__';
import { getAccessToken } from './token';
import * as url from '../utils/url';

import { fetchOrThrow } from './api';
import type { AuthConfig } from '../types/config.flow';

class OpenIdClient {

  config: AuthConfig;
  discovery: Discovery;

  constructor() {
    this.config = config.auth;
  }

  async discover(): Promise<Discovery> {
    const discovery: Discovery = await fetchOrThrow(`${this.config.authority}/.well-known/openid-configuration`);
    this.discovery = discovery;
    return discovery;
  }

  externalLoginUrl(provider: 'Google' | 'Facebook'): string {
    const returnUrl = `${this.discovery.authorization_endpoint.slice(this.discovery.issuer.length)}/login?${url.encodeQueryString({
      scope: this.config.scope,
      response_type: this.config.response_type,
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      state: Math.floor(Math.random() * 1000000)
    })}`;
    return `${this.discovery.issuer}/account/External?${url.encodeQueryString({
      provider: provider,
      returnUrl: returnUrl
    })}`;
  }

  async requestToken(code: string): Promise<Token> {
    const token: Token = await fetchOrThrow(this.discovery.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: url.encodeQueryString({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        redirect_uri: this.config.redirect_uri
      })
    });
    token['expires_at'] = moment(Date.now()).add(token.expires_in, 'seconds').toDate();
    return token;
  }

  async refreshToken(refresh_token: string): Promise<Token> {
    const token: Token = await fetchOrThrow(this.discovery.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: url.encodeQueryString({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
      })
    });
    token['expires_at'] = moment(Date.now()).add(token.expires_in, 'seconds').toDate();
    return token;
  }

  async getUserInfo() {
    const access_token = await getAccessToken();
    const user = await fetchOrThrow(this.discovery.userinfo_endpoint, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return user;
  }

  async logout(token: Token) {
    const revokeToken = await fetchOrThrow(this.discovery.revocation_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: url.encodeQueryString({
        token: token.refresh_token,
        token_type_hint: 'refresh_token',
        client_id: this.config.client_id,
        client_secret: this.config.client_secret
      })
    });
    return revokeToken;
  }
}

const oidc = new OpenIdClient();

export default oidc;
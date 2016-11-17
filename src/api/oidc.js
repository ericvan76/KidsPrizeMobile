/* @flow */

import moment from 'moment';
import CookieManager from 'react-native-cookies';
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
    return `${this.config.authority}/account/External?${url.encodeQueryString({
      provider: provider,
      returnUrl: returnUrl
    })}`;
  }

  async requestToken(code: string): Promise<Token> {
    const token: Token = await fetchOrThrow(this.discovery.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
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
        'Content-Type': 'application/x-www-form-urlencoded'
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
    const revokeToken = fetchOrThrow(this.discovery.revocation_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: url.encodeQueryString({
        token: token.refresh_token,
        token_type_hint: 'refresh_token',
        client_id: this.config.client_id,
        client_secret: this.config.client_secret
      })
    });
    const clearCookies = CookieManager.clearAll(() => { });
    return Promise.all([revokeToken, clearCookies]);
  }

  getLoginPage(): string {
    return `
<!DOCTYPE html>\n
<html lang="en">

<head>
  <title>Login</title>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
    crossorigin="anonymous">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
    crossorigin="anonymous"></script>
  <style>
  .btn-social {
    position: relative;
    padding-left: 44px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }

  .btn-social>:first-child {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    line-height: 34px;
    font-size: 1.6em;
    text-align: center;
    border-right: 1px solid rgba(0, 0, 0, 0.2)
  }

  .btn-social.btn-lg {
    padding-left: 61px
  }

  .btn-social.btn-lg>:first-child {
    line-height: 45px;
    width: 45px;
    font-size: 1.8em
  }

  .btn-social.btn-sm {
    padding-left: 38px
  }

  .btn-social.btn-sm>:first-child {
    line-height: 28px;
    width: 28px;
    font-size: 1.4em
  }

  .btn-social.btn-xs {
    padding-left: 30px
  }

  .btn-social.btn-xs>:first-child {
    line-height: 20px;
    width: 20px;
    font-size: 1.2em
  }

  .btn-social-icon {
    position: relative;
    padding-left: 44px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 34px;
    width: 34px;
    padding: 0
  }

  .btn-social-icon>:first-child {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    line-height: 34px;
    font-size: 1.6em;
    text-align: center;
    border-right: 1px solid rgba(0, 0, 0, 0.2)
  }

  .btn-social-icon.btn-lg {
    padding-left: 61px
  }

  .btn-social-icon.btn-lg>:first-child {
    line-height: 45px;
    width: 45px;
    font-size: 1.8em
  }

  .btn-social-icon.btn-sm {
    padding-left: 38px
  }

  .btn-social-icon.btn-sm>:first-child {
    line-height: 28px;
    width: 28px;
    font-size: 1.4em
  }

  .btn-social-icon.btn-xs {
    padding-left: 30px
  }

  .btn-social-icon.btn-xs>:first-child {
    line-height: 20px;
    width: 20px;
    font-size: 1.2em
  }

  .btn-social-icon>:first-child {
    border: none;
    text-align: center;
    width: 100% !important
  }

  .btn-social-icon.btn-lg {
    height: 45px;
    width: 45px;
    padding-left: 0;
    padding-right: 0
  }

  .btn-social-icon.btn-sm {
    height: 30px;
    width: 30px;
    padding-left: 0;
    padding-right: 0
  }

  .btn-social-icon.btn-xs {
    height: 22px;
    width: 22px;
    padding-left: 0;
    padding-right: 0
  }

  .btn-facebook {
    color: #fff;
    background-color: #3b5998;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-facebook:focus,
  .btn-facebook.focus {
    color: #fff;
    background-color: #2d4373;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-facebook:hover {
    color: #fff;
    background-color: #2d4373;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-facebook:active,
  .btn-facebook.active,
  .open>.dropdown-toggle.btn-facebook {
    color: #fff;
    background-color: #2d4373;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-facebook:active:hover,
  .btn-facebook.active:hover,
  .open>.dropdown-toggle.btn-facebook:hover,
  .btn-facebook:active:focus,
  .btn-facebook.active:focus,
  .open>.dropdown-toggle.btn-facebook:focus,
  .btn-facebook:active.focus,
  .btn-facebook.active.focus,
  .open>.dropdown-toggle.btn-facebook.focus {
    color: #fff;
    background-color: #23345a;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-facebook:active,
  .btn-facebook.active,
  .open>.dropdown-toggle.btn-facebook {
    background-image: none
  }

  .btn-facebook.disabled:hover,
  .btn-facebook[disabled]:hover,
  fieldset[disabled] .btn-facebook:hover,
  .btn-facebook.disabled:focus,
  .btn-facebook[disabled]:focus,
  fieldset[disabled] .btn-facebook:focus,
  .btn-facebook.disabled.focus,
  .btn-facebook[disabled].focus,
  fieldset[disabled] .btn-facebook.focus {
    background-color: #3b5998;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-facebook .badge {
    color: #3b5998;
    background-color: #fff
  }

  .btn-google {
    color: #fff;
    background-color: #dd4b39;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-google:focus,
  .btn-google.focus {
    color: #fff;
    background-color: #c23321;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-google:hover {
    color: #fff;
    background-color: #c23321;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-google:active,
  .btn-google.active,
  .open>.dropdown-toggle.btn-google {
    color: #fff;
    background-color: #c23321;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-google:active:hover,
  .btn-google.active:hover,
  .open>.dropdown-toggle.btn-google:hover,
  .btn-google:active:focus,
  .btn-google.active:focus,
  .open>.dropdown-toggle.btn-google:focus,
  .btn-google:active.focus,
  .btn-google.active.focus,
  .open>.dropdown-toggle.btn-google.focus {
    color: #fff;
    background-color: #a32b1c;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-google:active,
  .btn-google.active,
  .open>.dropdown-toggle.btn-google {
    background-image: none
  }

  .btn-google.disabled:hover,
  .btn-google[disabled]:hover,
  fieldset[disabled] .btn-google:hover,
  .btn-google.disabled:focus,
  .btn-google[disabled]:focus,
  fieldset[disabled] .btn-google:focus,
  .btn-google.disabled.focus,
  .btn-google[disabled].focus,
  fieldset[disabled] .btn-google.focus {
    background-color: #dd4b39;
    border-color: rgba(0, 0, 0, 0.2)
  }

  .btn-google .badge {
    color: #dd4b39;
    background-color: #fff
  }
  </style>
</head>

<body style="margin:40px;margin-top:60px;text-align:center">
  <br/>
  <br/>
  <a class="btn btn-block btn-social btn-lg btn-facebook" href="${this.externalLoginUrl('Facebook')}">
    <span class="fa fa-facebook"></span> Sign in with Facebook
  </a>
  <a class="btn btn-block btn-social btn-lg btn-google" href="${this.externalLoginUrl('Google')}">
    <span class="fa fa-google"></span> Sign in with Google
  </a>
</body>

</html>
`;
  }
}

const oidc = new OpenIdClient();

export default oidc;
/* @flow */

import * as uuid from 'uuid';

import { initialised, setToken, clearToken, setUser } from '../actions/auth';
import reducer from './auth';
import { INITIAL_STATE } from './initialState';
import type { AuthState } from '../types/states.flow';


describe('reducers', () => {
  describe('auth', () => {

    it('test initialised', () => {
      const token: Token = {
        access_token: uuid.v4(),
        token_type: 'Bearer',
        expires_in: 3600,
        expires_at: new Date()
      };
      const state = reducer(INITIAL_STATE.auth, initialised(discovery, token));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.discovery).toEqual(discovery);
      expect(state.token).toEqual(token);
      expect(state.user).toBeNull();
    });


    it('test set token', () => {
      const initState: AuthState = {
        initialised: true,
        discovery: discovery,
        token: {
          access_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: new Date()
        },
        user: null
      };
      const token: Token = {
        access_token: uuid.v4(),
        token_type: 'Bearer',
        expires_in: 3600,
        expires_at: new Date()
      };
      const state = reducer(initState, setToken(token));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.discovery).toEqual(discovery);
      expect(state.token).toEqual(token);
      expect(state.user).toBeNull();
    });

    it('test clear token', () => {
      const initState: AuthState = {
        initialised: true,
        discovery: discovery,
        token: {
          access_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: new Date()
        },
        user: {
          given_name: 'Eric',
          family_name: 'Fan',
          name: 'Eric Fan',
          sub: uuid.v4()
        }
      };

      const state = reducer(initState, clearToken());
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.discovery).toEqual(discovery);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });

    it('test user info', () => {
      const initState: AuthState = {
        initialised: true,
        discovery: discovery,
        token: {
          access_token: 'xyz',
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: new Date()
        },
        user: null
      };

      const user = {
        given_name: 'Eric',
        family_name: 'Fan',
        name: 'Eric Fan',
        sub: '223476523'
      };

      const state = reducer(initState, setUser(user));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.discovery).toEqual(discovery);
      expect(state.token).toEqual(initState.token);
      expect(state.user).toEqual(user);
    });

  });
});

const discovery: Discovery = {
  issuer: 'https://openid.domain.com',
  jwks_uri: 'https://openid.domain.com/.well-known/openid-configuration/jwks',
  authorization_endpoint: 'https://openid.domain.com/connect/authorize',
  token_endpoint: 'https://openid.domain.com/connect/token',
  userinfo_endpoint: 'https://openid.domain.com/connect/userinfo',
  end_session_endpoint: 'https://openid.domain.com/connect/endsession',
  check_session_iframe: 'https://openid.domain.com/connect/checksession',
  revocation_endpoint: 'https://openid.domain.com/connect/revocation',
  introspection_endpoint: 'https://openid.domain.com/connect/introspect',
  frontchannel_logout_supported: true,
  frontchannel_logout_session_supported: true,
  scopes_supported: ['openid', 'profile', 'offline_access', 'api1'],
  claims_supported:
  ['sub',
    'name',
    'family_name',
    'given_name',
    'middle_name',
    'nickname',
    'preferred_username',
    'profile',
    'picture',
    'website',
    'gender',
    'birthdate',
    'zoneinfo',
    'locale',
    'updated_at'],
  response_types_supported:
  ['code',
    'token',
    'id_token',
    'id_token token',
    'code id_token',
    'code token',
    'code id_token token'],
  response_modes_supported: ['form_post', 'query', 'fragment'],
  grant_types_supported:
  ['authorization_code',
    'client_credentials',
    'refresh_token',
    'implicit'],
  subject_types_supported: ['public'],
  id_token_signing_alg_values_supported: ['RS256'],
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
  code_challenge_methods_supported: ['plain', 'S256']
};
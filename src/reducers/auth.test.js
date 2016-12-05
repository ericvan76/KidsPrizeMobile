/* @flow */

import * as uuid from 'uuid';

import { initialised, updateToken, clearToken, setProfile } from '../actions/auth';
import reducer from './auth';
import { INITIAL_STATE } from './initialState';
import type { AuthState } from '../types/states.flow';
import type { Token, Profile } from '../types/auth.flow';

describe('reducers', () => {
  describe('auth', () => {

    it('test initialised', () => {
      const token: Token = {
        id_token: uuid.v4(),
        refresh_token: uuid.v4(),
        token_type: 'Bearer',
        expires_in: 3600,
        expires_at: new Date()
      };
      const state = reducer(INITIAL_STATE.auth, initialised(token));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toEqual(token);
      expect(state.profile).toBeNull();
    });


    it('test set token', () => {
      const initState: AuthState = {
        initialised: true,
        token: {
          id_token: uuid.v4(),
          refresh_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: new Date()
        },
        profile: null
      };
      const token: Token = {
        id_token: uuid.v4(),
        refresh_token: uuid.v4(),
        token_type: 'Bearer',
        expires_in: 3600,
        expires_at: new Date()
      };
      const state = reducer(initState, updateToken(token));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toEqual(token);
      expect(state.profile).toBeNull();
    });

    it('test clear token', () => {
      const initState: AuthState = {
        initialised: true,
        token: {
          id_token: uuid.v4(),
          refresh_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: new Date()
        },
        profile: {
          email: 'name@domain.com',
          given_name: 'Eric',
          family_name: 'Fan',
          name: 'Eric Fan',
          sub: uuid.v4()
        }
      };

      const state = reducer(initState, clearToken());
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toBeNull();
      expect(state.profile).toBeNull();
    });

    it('test user info', () => {
      const initState: AuthState = {
        initialised: true,
        token: {
          id_token: uuid.v4(),
          refresh_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600,
          expires_at: new Date()
        },
        profile: null
      };

      const profile: Profile = {
        email: 'name@domain.com',
        given_name: 'Eric',
        family_name: 'Fan',
        name: 'Eric Fan',
        sub: '223476523'
      };

      const state = reducer(initState, setProfile(profile));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toEqual(initState.token);
      expect(state.profile).toEqual(profile);
    });

  });
});


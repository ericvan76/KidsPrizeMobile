/* @flow */

import * as uuid from 'uuid';

import { initialised, updateToken, clearToken } from '../actions/auth';
import reducer from './auth';
import { INITIAL_STATE } from './initialState';
import type { AuthState } from '../types/states.flow';
import type { Token } from '../types/auth.flow';

describe('reducers', () => {
  describe('auth', () => {

    it('test initialised', () => {
      const token: Token = {
        access_token: uuid.v4(),
        id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
        refresh_token: uuid.v4(),
        token_type: 'Bearer',
        expires_in: 3600
      };
      const state = reducer(INITIAL_STATE.auth, initialised(token));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toEqual(token);
      expect(state.profile).toBeDefined();
    });


    it('test set token', () => {
      const initState: AuthState = {
        initialised: true,
        token: {
          access_token: uuid.v4(),
          id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
          refresh_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600
        },
        profile: {
          email: 'name@domain.com',
          given_name: 'Eric',
          family_name: 'Fan',
          name: 'Eric Fan',
          sub: uuid.v4(),
          iss: 'https://x.y.z/',
          aud: 'abc',
          exp: 2234567890,
          iat: 1234567890
        }
      };
      const token: Token = {
        access_token: uuid.v4(),
        id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
        refresh_token: uuid.v4(),
        token_type: 'Bearer',
        expires_in: 3600
      };
      const state = reducer(initState, updateToken(token));
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toEqual(token);
      expect(state.profile).toBeDefined();
    });

    it('test clear token', () => {
      const initState: AuthState = {
        initialised: true,
        token: {
          access_token: uuid.v4(),
          id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
          refresh_token: uuid.v4(),
          token_type: 'Bearer',
          expires_in: 3600
        },
        profile: {
          email: 'name@domain.com',
          given_name: 'Eric',
          family_name: 'Fan',
          name: 'Eric Fan',
          sub: uuid.v4(),
          iss: 'https://x.y.z/',
          aud: 'abc',
          exp: 2234567890,
          iat: 1234567890
        }
      };

      const state = reducer(initState, clearToken());
      expect(state).toBeTruthy();
      expect(state.initialised).toEqual(true);
      expect(state.token).toBeNull();
      expect(state.profile).toBeNull();
    });

  });
});


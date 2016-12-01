/* @flow */
import type { AppState } from '../types/states.flow';

export const INITIAL_STATE: AppState = {
  auth: {
    initialised: false,
    discovery: null,
    authCode: null,
    token: null,
    user: null
  },
  currentChild: null,
  children: {
    isNotLoaded: true
  },
  form: {
    childForm: null
  },
  errors: []
};

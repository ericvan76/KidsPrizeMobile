/* @flow */
import type { AppState } from '../types/states.flow';

export const INITIAL_STATE: AppState = {
  auth: {
    initialised: false,
    token: null,
    profile: null
  },
  currentChild: null,
  children: {
    isNotLoaded: true
  },
  errors: []
};

/* @flow */
import type { AppState } from '../types/states.flow';

export const INITIAL_STATE: AppState = {
  auth: {
    initialised: false,
    discovery: null,
    token: null,
    user: null
  },
  currentChild: null,
  children: {},
  form: {
    childForm: null
  },
  errors: []
};

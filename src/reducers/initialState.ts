import { AppState } from 'src/store';

export const INITIAL_STATE: AppState = {
  auth: {
    profile: undefined
  },
  children: {},
  currentChild: null,
  requestState: {
    requesting: {},
    errors: {}
  }
};

import { AppState } from 'src/store';

export const INITIAL_STATE: AppState = {
  auth: {
    profile: undefined
  },
  children: {},
  // tslint:disable-next-line: no-null-keyword
  currentChild: null,
  requestState: {
    requesting: {},
    errors: {}
  }
};

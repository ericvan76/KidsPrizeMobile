
import { AppState } from '../types/states';

export const INITIAL_STATE: AppState = {
  auth: {
    tokenLoaded: false,
    token: undefined,
    profile: undefined
  },
  children: {
  },
  errors: []
};


import { AppState } from '../types/states';

export const INITIAL_STATE: AppState = {
  auth: {
    tokenLoadCompleted: false,
    token: undefined,
    profile: undefined
  },
  initialised: false,
  children: {
  },
  errors: []
};

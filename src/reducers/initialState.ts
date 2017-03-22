
import { AppState, ChildState } from '../types/states';

export const INITIAL_STATE: AppState = {
  auth: {
    tokenLoadCompleted: false,
    token: undefined,
    profile: undefined
  },
  initialised: false,
  children: new Map<string, ChildState>(),
  errors: []
};

import * as actions from 'src/actions/auth';
import { Profile } from 'src/api/auth';
import { AuthState } from 'src/store';
import { INITIAL_STATE } from './initialState';

export function authReducer(
  state: AuthState = INITIAL_STATE.auth,
  action:
    typeof actions.updateProfile.shape
): AuthState {
  switch (action.type) {
    case actions.updateProfile.type: {
      const payload: Profile | undefined = action.payload;
      return {
        ...state,
        profile: payload
      };
    }
    default:
      return state;
  }
}

import { FAILURE, failureAction, RESET_FAILURE, resetFailureAction } from '../actions/failure';
import { INITIAL_STATE } from './initialState';

export default function reducer(
  state: Array<Error> = INITIAL_STATE.errors,
  action: failureAction | resetFailureAction) {
  switch (action.type) {
    case FAILURE:
      {
        const error = action.payload as Error;
        return [...state, error];
      }
    case RESET_FAILURE:
      {
        return [];
      }
    default:
      return state;
  }
}

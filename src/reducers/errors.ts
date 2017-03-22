import { RAISE_ERROR, raiseErrorAction, RESET_ERROR, resetErrorAction } from '../actions/errors';
import { INITIAL_STATE } from './initialState';

export default function reducer(
  state: Array<Error> = INITIAL_STATE.errors,
  action: raiseErrorAction | resetErrorAction) {
  switch (action.type) {
    case RAISE_ERROR:
      {
        const error = action.payload as Error;
        return [...state, error];
      }
    case RESET_ERROR:
      {
        return [];
      }
    default:
      return state;
  }
}

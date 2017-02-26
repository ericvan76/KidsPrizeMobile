import { Action } from '../types/actions';

export const FAILURE = 'FAILURE';
export type failureAction = Action<typeof FAILURE, Error>;
export function failure(err: Error): failureAction {
  return {
    type: FAILURE,
    payload: err
  };
}

export const RESET_FAILURE = 'RESET_FAILURE';
export type resetFailureAction = Action<typeof RESET_FAILURE, void>;
export function resetFailure(): resetFailureAction {
  return {
    type: RESET_FAILURE,
    payload: undefined
  };
}

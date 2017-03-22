import { Action } from '../types/actions';

export const RAISE_ERROR = 'RAISE_ERROR';
export type raiseErrorAction = Action<typeof RAISE_ERROR, Error>;
export function raiseError(err: Error): raiseErrorAction {
  return {
    type: RAISE_ERROR,
    payload: err
  };
}

export const RESET_ERROR = 'RESET_ERROR';
export type resetErrorAction = Action<typeof RESET_ERROR, void>;
export function resetError(): resetErrorAction {
  return {
    type: RESET_ERROR,
    payload: undefined
  };
}

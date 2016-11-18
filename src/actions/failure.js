/* @flow */
import type { Action } from '../types/actions.flow';

export const FAILURE: string = 'FAILURE';
export const RESET_FAILURE: string = 'RESET_FAILURE';

export function failure(err: Error): Action<'FAILURE', Error> {
  return {
    type: 'FAILURE',
    payload: err
  };
}

export function resetFailure(): Action<'RESET_FAILURE', void> {
  return {
    type: 'RESET_FAILURE',
    payload: undefined
  };
}

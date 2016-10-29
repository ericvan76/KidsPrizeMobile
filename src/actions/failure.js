/* @flow */

export const FAILURE: string = 'FAILURE';

export function failure(err: Error) {
  return {
    type: 'FAILURE',
    payload: err
  };
}

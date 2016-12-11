/* @flow */

import update from 'react-addons-update';
import { FAILURE, RESET_FAILURE } from '../actions/failure';
import { INITIAL_STATE } from './initialState';

import type { Action } from '../types/actions.flow';

export default function reducer(state: any[] = INITIAL_STATE.errors, action: Action<any, any>) {
  switch (action.type) {
    case FAILURE:
      {
        return update(state, { $push: [action.payload] });
      }
    case RESET_FAILURE:
      {
        return [];
      }
    default:
      return state;
  }
}

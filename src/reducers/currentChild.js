/* @flow */

import { SWITCH_CHILD } from '../actions/child';
import { CLEAR_TOKEN } from '../actions/auth';
import { INITIAL_STATE } from './initialState';

import type { Action } from '../types/actions.flow';


export default function reducer(state: ?string = INITIAL_STATE.currentChild, action: Action<any, any>) {
  switch (action.type) {
    case SWITCH_CHILD:
      {
        return action.payload;
      }
    case CLEAR_TOKEN:
      {
        return null;
      }
    default:
      return state;
  }
}

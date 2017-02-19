/* @flow */

import { ADD_CHILDREN, UPDATE_CHILD, SWITCH_CHILD, DELETE_CHILD } from '../actions/child';
import { CLEAR_TOKEN } from '../actions/auth';
import { INITIAL_STATE } from './initialState';

import type { Action } from '../types/actions.flow';
import type { Child, ScoreResult } from '../types/api.flow';

export default function reducer(state: ?string = INITIAL_STATE.currentChild, action: Action<any, any>) {
  switch (action.type) {
    case ADD_CHILDREN:
      {
        if (state === null) {
          const children: Child[] = action.payload;
          if (children.length > 0) {
            return children[0].id;
          }
        }
        return state;
      }
    case UPDATE_CHILD:
      {
        if (state === null) {
          const payload: ScoreResult = action.payload;
          return payload.child.id;
        }
        return state;
      }
    case SWITCH_CHILD:
      {
        return action.payload;
      }
    case DELETE_CHILD:
      {
        const childId: string = action.payload;
        if (state === childId) {
          return null;
        }
        return state;
      }
    case CLEAR_TOKEN:
      {
        return null;
      }
    default:
      return state;
  }
}

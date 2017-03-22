import { batchActions } from 'redux-batched-actions';

import * as api from '../api/api';
import { REDEEMS_TO_LOAD } from '../constants';
import { Action, AsyncAction } from '../types/actions';
import { Redeem } from '../types/api';
import { updateChild } from './children';
import { raiseError } from './errors';

export const UPDATE_REDEEMS = 'UPDATE_REDEEMS';
export type UpdateRedeemsAction = Action<typeof UPDATE_REDEEMS, {
  childId: string;
  redeems: Array<Redeem>;
}>;
export function updateRedeems(childId: string, redeems: Array<Redeem>): UpdateRedeemsAction {
  return {
    type: UPDATE_REDEEMS,
    payload: {
      childId,
      redeems
    }
  };
}

export function createRedeemAsync(childId: string, description: string, value: number): AsyncAction {
  return async (dispatch, getState) => {
    try {
      const redeem = await api.createRedeem(childId, description, value);
      const childState = getState().children.get(childId);
      if (childState) {
        dispatch(batchActions([
          updateRedeems(childId, [redeem]),
          updateChild({ ...childState.child, totalScore: childState.child.totalScore - value })
        ]));
      }
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function fetchRedeemsAsync(childId: string): AsyncAction {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const childState = state.children.get(childId);
      if (childState) {
        const offset = childState.redeems.length;
        const redeems = await api.getRedeems(childId, REDEEMS_TO_LOAD, offset);
        dispatch(updateRedeems(childId, redeems));
      }
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

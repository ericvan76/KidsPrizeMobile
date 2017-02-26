import moment from 'moment';
import * as Constants from '../constants';

import * as api from '../api/api';
import { Action, AddRedeemsPayload, AsyncAction, UpdateScorePayload } from '../types/actions';
import { Child, Gender, Redeem, ScoreResult } from '../types/api';
import { failure } from './failure';

const WEEKS_TO_LOAD: number = 4;

export const ADD_CHILDREN = 'ADD_CHILDREN';
export type AddChildrenAction = Action<typeof ADD_CHILDREN, Array<Child>>;
export function addChildren(children: Array<Child>): AddChildrenAction {
  return {
    type: ADD_CHILDREN,
    payload: children
  };
}

export const SWITCH_CHILD = 'SWITCH_CHILD';
export type SwitchChildAction = Action<typeof SWITCH_CHILD, string>;
export function switchChild(childId: string): SwitchChildAction {
  return {
    type: SWITCH_CHILD,
    payload: childId
  };
}

export const DELETE_CHILD = 'DELETE_CHILD';
export type DeleteChildAction = Action<typeof DELETE_CHILD, string>;
export function deleteChild(childId: string): DeleteChildAction {
  return {
    type: DELETE_CHILD,
    payload: childId
  };
}

export const UPDATE_CHILD = 'UPDATE_CHILD';
export type UpdateChildAction = Action<typeof UPDATE_CHILD, ScoreResult>;
export function updateChild(scoreResult: ScoreResult): UpdateChildAction {
  return {
    type: UPDATE_CHILD,
    payload: scoreResult
  };
}

export const UPDATE_SCORE = 'UPDATE_SCORE';
export type UpdateScoreAction = Action<typeof UPDATE_SCORE, UpdateScorePayload>;
export function updateScore(childId: string, date: string, task: string, value: number): UpdateScoreAction {
  return {
    type: UPDATE_SCORE,
    payload: {
      childId,
      date,
      task,
      value
    }
  };
}

export const ADD_REDEEMS = 'ADD_REDEEMS';
export type AddRedeemsAction = Action<typeof ADD_REDEEMS, AddRedeemsPayload>;
export function addRedeems(childId: string, redeems: Array<Redeem>, updateTotal: boolean): AddRedeemsAction {
  return {
    type: ADD_REDEEMS,
    payload: {
      childId,
      redeems,
      updateTotal
    }
  };
}

// Async Actions
export function listChildrenAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      // todo: implement preference state
      await api.setPreference({
        timeZoneOffset: new Date().getTimezoneOffset()
      });
      const children: Array<Child> = await api.listChildren();
      dispatch(addChildren(children));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function createChildAsync(childId: string, name: string, gender: Gender, tasks: Array<string>): AsyncAction {
  return async (dispatch) => {
    try {
      const result: ScoreResult = await api.createChild(childId, name, gender, tasks);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function updateChildAsync(childId: string, name: string, gender: Gender, tasks: Array<string>): AsyncAction {
  return async (dispatch) => {
    try {
      const result: ScoreResult = await api.updateChild(childId, name, gender, tasks);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function deleteChildAsync(childId: string): AsyncAction {
  return async (dispatch) => {
    try {
      await api.deleteChild(childId);
      dispatch(deleteChild(childId));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function setScoreAsync(childId: string, date: string, task: string, value: number): AsyncAction {
  return async (dispatch) => {
    try {
      await api.setScore(childId, date, task, value);
      dispatch(updateScore(childId, date, task, value));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function refreshAsync(childId: string): AsyncAction {
  return async (dispatch) => {
    try {
      const rewindFrom = moment().day(7).format(Constants.DATE_FORMAT);
      const result = await api.getScores(childId, rewindFrom, WEEKS_TO_LOAD);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function fetchMoreAsync(childId: string): AsyncAction {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const loadedWeeks = Object.keys(state.children[childId].weeklyScores);
      if (loadedWeeks.length > 0) {
        const lastWeek = loadedWeeks[loadedWeeks.length - 1];
        const result = await api.getScores(childId, lastWeek, WEEKS_TO_LOAD);
        dispatch(updateChild(result));
      }
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function createRedeemAsync(childId: string, description: string, value: number): AsyncAction {
  return async (dispatch) => {
    try {
      const redeem = await api.createRedeem(childId, description, value);
      dispatch(addRedeems(childId, [redeem], true));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function getRedeemsAsync(childId: string): AsyncAction {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const offset = state.children[childId].redeems.length;
      const redeems = await api.getRedeems(childId, 25, offset);
      dispatch(addRedeems(childId, redeems, false));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

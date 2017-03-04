import moment from 'moment';
import { batchActions } from 'redux-batched-actions';

import * as api from '../api/api';
import * as Constants from '../constants';
import { Action, AddRedeemsPayload, AsyncAction, UpdateScorePayload } from '../types/actions';
import { Child, Gender, Redeem, ScoreResult } from '../types/api';
import { failure } from './failure';

const WEEKS_TO_LOAD: number = 4;

export const LOAD_CHILDREN = 'LOAD_CHILDREN';
export type LoadChildrenAction = Action<typeof LOAD_CHILDREN, Array<Child>>;
export function loadChildren(children: Array<Child>): LoadChildrenAction {
  return {
    type: LOAD_CHILDREN,
    payload: children
  };
}

export const SET_INITIALISED = 'SET_INITIALISED';
export type SetInitialisedAction = Action<typeof SET_INITIALISED, boolean>;
export function setInitialised(initialised: boolean): SetInitialisedAction {
  return {
    type: SET_INITIALISED,
    payload: initialised
  };
}

export const SWITCH_CHILD = 'SWITCH_CHILD';
export type SwitchChildAction = Action<typeof SWITCH_CHILD, string | undefined>;
export function switchChild(childId: string | undefined): SwitchChildAction {
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

export const SET_SCORE = 'SET_SCORE';
export type SetScoreAction = Action<typeof SET_SCORE, UpdateScorePayload>;
export function setScore(childId: string, date: string, task: string, value: number): SetScoreAction {
  return {
    type: SET_SCORE,
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
export function loadChildrenAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      // todo: implement preference state
      await api.setPreference({
        timeZoneOffset: new Date().getTimezoneOffset()
      });
      const children: Array<Child> = await api.listChildren();
      dispatch(batchActions([
        loadChildren(children),
        switchChild(children.length > 0 ? children[0].id : undefined),
        setInitialised(true)
      ]));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function createChildAsync(childId: string, name: string, gender: Gender, tasks: Array<string>): AsyncAction {
  return async (dispatch) => {
    try {
      const result = await api.createChild(childId, name, gender, tasks);
      dispatch(batchActions([
        updateChild(result),
        switchChild(result.child.id)
      ]));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function updateChildAsync(childId: string, name: string, gender: Gender, tasks: Array<string>): AsyncAction {
  return async (dispatch) => {
    try {
      const result = await api.updateChild(childId, name, gender, tasks);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function deleteChildAsync(childId: string): AsyncAction {
  return async (dispatch, getState) => {
    try {
      await api.deleteChild(childId);
      const nextChildId = Object.keys(getState().children).find(k => k !== childId);
      dispatch(batchActions([
        deleteChild(childId),
        switchChild(nextChildId)
      ]));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function setScoreAsync(childId: string, date: string, task: string, value: number): AsyncAction {
  return async (dispatch) => {
    try {
      await api.setScore(childId, date, task, value);
      dispatch(setScore(childId, date, task, value));
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

/* @flow */
import moment from 'moment';
import * as api from '../api/api';
import { failure } from './failure';

import type { AppState } from '../types/states.flow';
import type { Action, UpdateScorePayload, AddRedeemsPayload } from '../types/actions.flow';
import type { Child, ScoreResult, Redeem, Gender } from '../types/api.flow';

const WEEKS_TO_LOAD: number = 4;

export const ADD_CHILDREN: string = 'ADD_CHILDREN';
export const SWITCH_CHILD: string = 'SWITCH_CHILD';
export const DELETE_CHILD: string = 'DELETE_CHILD';
export const UPDATE_CHILD: string = 'UPDATE_CHILD';
export const UPDATE_SCORE: string = 'UPDATE_SCORE';
export const ADD_REDEEMS: string = 'ADD_REDEEMS';

// to fix formatter
type nullableString = ?string;

export function addChildren(children: Child[]): Action<'ADD_CHILDREN', Child[]> {
  return {
    type: 'ADD_CHILDREN',
    payload: children
  };
}

export function switchChild(childId: ?string): Action<'SWITCH_CHILD', nullableString> {
  return {
    type: 'SWITCH_CHILD',
    payload: childId
  };
}

export function deleteChild(childId: string): Action<'DELETE_CHILD', string> {
  return {
    type: 'DELETE_CHILD',
    payload: childId
  };
}

export function updateChild(scoreResult: ScoreResult): Action<'UPDATE_CHILD', ScoreResult> {
  return {
    type: 'UPDATE_CHILD',
    payload: scoreResult
  };
}

export function updateScore(childId: string, date: string, task: string, value: number): Action<'UPDATE_SCORE', UpdateScorePayload> {
  return {
    type: 'UPDATE_SCORE',
    payload: {
      childId: childId,
      date: date,
      task: task,
      value: value
    }
  };
}

export function addRedeems(childId: string, redeems: Redeem[], updateTotal: boolean): Action<'ADD_REDEEMS', AddRedeemsPayload> {
  return {
    type: 'ADD_REDEEMS',
    payload: {
      childId: childId,
      redeems: redeems,
      updateTotal: updateTotal
    }
  };
}

// Async Actions

export function listChildrenAsync() {
  return async (dispatch: Dispatch) => {
    try {
      // todo: implement preference state
      await api.setPreference({
        timeZoneOffset: new Date().getTimezoneOffset()
      });
      const children: Child[] = await api.listChildren();
      dispatch(addChildren(children));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function createChildAsync(childId: string, name: string, gender: Gender, tasks: string[]) {
  return async (dispatch: Dispatch) => {
    try {
      const result: ScoreResult = await api.createChild(childId, name, gender, tasks);
      dispatch(updateChild(result));
      dispatch(switchChild(childId));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function updateChildAsync(childId: string, name: string, gender: Gender, tasks: string[]) {
  return async (dispatch: Dispatch) => {
    try {
      const result: ScoreResult = await api.updateChild(childId, name, gender, tasks);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function deleteChildAsync(childId: string) {
  return async (dispatch: Dispatch, getState: Function) => {
    try {
      await api.deleteChild(childId);
      const state: AppState = getState();
      if (state.currentChild === childId) {
        const childIdArray = Object.keys(state.children);
        const nextChildId = childIdArray.find((id: string) => { return id !== childId; });
        dispatch(switchChild(nextChildId || null));
      }
      dispatch(deleteChild(childId));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function setScoreAsync(childId: string, date: string, task: string, value: number) {
  return async (dispatch: Dispatch) => {
    try {
      await api.setScore(childId, date, task, value);
      dispatch(updateScore(childId, date, task, value));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function refreshAsync(childId: string) {
  return async (dispatch: Dispatch) => {
    try {
      const rewindFrom = moment().day(7).format('YYYY-MM-DD');
      const result = await api.getScores(childId, rewindFrom, WEEKS_TO_LOAD);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function fetchMoreAsync(childId: string) {
  return async (dispatch: Dispatch, getState: Function) => {
    try {
      const state: AppState = getState();
      const loadedWeeks = Object.keys(state.children[childId].weeklyScores);
      if (loadedWeeks.length === 0) {
        dispatch(refreshAsync(childId));
        return;
      }
      const lastWeek = loadedWeeks[loadedWeeks.length - 1];
      const result = await api.getScores(childId, lastWeek, WEEKS_TO_LOAD);
      dispatch(updateChild(result));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

export function createRedeemAsync(childId: string, description: string, value: number) {
  return async (dispatch: Dispatch) => {
    try {
      const redeem = await api.createRedeem(childId, description, value);
      dispatch(addRedeems(childId, [redeem], true));
    } catch (err) {
      dispatch(failure(err));
    }
  };
}

// hack: avoid called multiple times
let locked = false;

export function getRedeemsAsync(childId: string) {
  return async (dispatch: Dispatch, getState: Function) => {
    try {
      const state: AppState = getState();
      const offset = state.children[childId].redeems.length;
      if (!locked) {
        locked = true;
        const redeems = await api.getRedeems(childId, 25, offset);
        dispatch(addRedeems(childId, redeems, false));
        locked = false;
      }
    } catch (err) {
      dispatch(failure(err));
    }
  };
}


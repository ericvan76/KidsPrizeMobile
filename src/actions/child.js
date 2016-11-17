/* @flow */
import moment from 'moment';
import * as api from '../api/api';

import type { AppState } from '../types/states.flow';
import type { Action, UpdateScorePayload } from '../types/actions.flow';

const WEEKS_TO_LOAD: number = 4;

export const SWITCH_CHILD: string = 'SWITCH_CHILD';
export const DELETE_CHILD: string = 'DELETE_CHILD';
export const UPDATE_CHILD: string = 'UPDATE_CHILD';
export const UPDATE_SCORE: string = 'UPDATE_SCORE';

// to fix formatter
type nullableString = ?string;

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

// Async Actions

export function listChildrenAsync() {
  return async (dispatch: Dispatch) => {
    const children: Child[] = await api.listChildren();
    children.forEach((child: Child) => {
      dispatch(refreshAsync(child.id));
    });
    if (children.length > 0) {
      dispatch(switchChild(children[0].id));
    }
  };
}

export function createChildAsync(childId: string, name: string, gender: Gender, tasks: string[]) {
  return async (dispatch: Dispatch) => {
    const result: ScoreResult = await api.createChild(childId, name, gender, tasks);
    dispatch(updateChild(result));
    dispatch(switchChild(childId));
  };
}

export function updateChildAsync(childId: string, name: string, gender: Gender, tasks: string[]) {
  return async (dispatch: Dispatch) => {
    const result: ScoreResult = await api.updateChild(childId, name, gender, tasks);
    dispatch(updateChild(result));
  };
}

export function removeChildAsync(childId: string) {
  return async (dispatch: Dispatch, getState: Function) => {
    const state: AppState = getState();
    if (state.currentChild === childId) {
      const anotherChildId: ?string = Object.keys(state.children).find(id => id !== childId);
      dispatch(switchChild(anotherChildId));
    }
    await api.deleteChild(childId);
    dispatch(deleteChild(childId));
  };
}

export function setScoreAsync(childId: string, date: string, task: string, value: number) {
  return async (dispatch: Dispatch) => {
    await api.setScore(childId, date, task, value);
    dispatch(updateScore(childId, date, task, value));
  };
}

export function refreshAsync(childId: string) {
  return async (dispatch: Dispatch) => {
    const rewindFrom = moment(Date.now()).utcOffset(0, true).startOf('day').day(7);
    const result = await api.getScores(childId, rewindFrom.format('YYYY-MM-DD'), WEEKS_TO_LOAD);
    dispatch(updateChild(result));
  };
}

export function fetchMoreAsync(childId: string) {
  return async (dispatch: Dispatch, getState: Function) => {
    const state: AppState = getState();
    const loadedWeeks = Object.keys(state.children[childId].weeklyScores);
    if (loadedWeeks.length === 0) {
      dispatch(refreshAsync(childId));
      return;
    }
    const lastWeek = loadedWeeks[loadedWeeks.length - 1];
    const rewindFrom = moment(Date.parse(lastWeek)).utc();
    const result = await api.getScores(childId, rewindFrom.format('YYYY-MM-DD'), WEEKS_TO_LOAD);
    dispatch(updateChild(result));
  };
}



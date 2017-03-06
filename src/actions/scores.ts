import moment from 'moment';
import { batchActions } from 'redux-batched-actions';

import * as api from '../api/api';
import { DATE_FORMAT, WEEKS_TO_LOAD } from '../constants';
import { Action, AsyncAction } from '../types/actions';
import { WeeklyScore } from '../types/api';
import { updateChild } from './children';
import { raiseError } from './errors';

export const UPDATE_SCORES = 'UPDATE_SCORES';
export type UpdateScoresAction = Action<typeof UPDATE_SCORES, {
  childId: string,
  weeklyScores: Array<WeeklyScore>
}>;
export function updateScores(childId: string, weeklyScores: Array<WeeklyScore>): UpdateScoresAction {
  return {
    type: UPDATE_SCORES,
    payload: {
      childId,
      weeklyScores
    }
  };
}

export const SET_SCORE = 'SET_SCORE';
export type SetScoreAction = Action<typeof SET_SCORE, {
  childId: string;
  date: string;
  task: string;
  value: number;
}>;
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

export function setScoreAsync(childId: string, date: string, task: string, value: number): AsyncAction {
  return async (dispatch, getState) => {
    try {
      const childState = getState().children.get(childId);
      if (childState) {
        await api.setScore(childId, date, task, value);
        dispatch(batchActions([
          setScore(childId, date, task, value),
          updateChild({ ...childState.child, totalScore: childState.child.totalScore + (value > 0 ? 1 : -1) })
        ]));
      }
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function refreshAsync(childId: string): AsyncAction {
  return async (dispatch) => {
    try {
      const rewindFrom = moment().day(7).format(DATE_FORMAT);
      const result = await api.getScores(childId, rewindFrom, WEEKS_TO_LOAD);
      dispatch(batchActions([
        updateChild(result.child),
        updateScores(childId, result.weeklyScores)
      ]));
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function fetchMoreAsync(childId: string): AsyncAction {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const childState = state.children.get(childId);
      if (childState) {
        const loadedWeeks = [...childState.scores.keys()];
        if (loadedWeeks.length > 0) {
          const lastWeek = loadedWeeks[loadedWeeks.length - 1];
          const result = await api.getScores(childId, lastWeek, WEEKS_TO_LOAD);
          dispatch(batchActions([
            updateChild(result.child),
            updateScores(childId, result.weeklyScores)
          ]));
        } else {
          dispatch(refreshAsync(childId));
        }
      }
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

import moment from 'moment';

import { CLEAR_TOKEN, ClearTokenAction } from '../actions/auth';
import {
  ADD_CHILDREN,
  ADD_REDEEMS,
  AddChildrenAction,
  AddRedeemsAction,
  DELETE_CHILD,
  DeleteChildAction,
  SWITCH_CHILD,
  SwitchChildAction,
  UPDATE_CHILD,
  UPDATE_SCORE,
  UpdateChildAction,
  UpdateScoreAction
} from '../actions/child';

import * as Constants from '../constants';
import { AddRedeemsPayload, UpdateScorePayload } from '../types/actions';
import { Child, Redeem, Score, ScoreResult } from '../types/api';
import { ChildrenState, WeeklyScoresState } from '../types/states';
import { INITIAL_STATE } from './initialState';

// tslint:disable-next-line:max-func-body-length
export default function (
  state: ChildrenState = INITIAL_STATE.children,
  action: AddChildrenAction |
    UpdateChildAction |
    DeleteChildAction |
    SwitchChildAction |
    UpdateScoreAction |
    AddRedeemsAction |
    ClearTokenAction) {
  switch (action.type) {
    case ADD_CHILDREN: {
      const children = action.payload as Array<Child>;
      let flag = Object.keys(state).length === 0;
      return children.reduce(
        (prev: ChildrenState, child: Child) => {
          prev[child.id] = {
            isCurrent: flag,
            child,
            weeklyScores: {},
            redeems: []
          };
          flag = false;
          return prev;
        },
        {}) as ChildrenState;
    }
    case UPDATE_CHILD:
      {
        const payload = action.payload as ScoreResult;
        const weeklyScores: WeeklyScoresState = payload.weeklyScores.reduce(
          (prev: WeeklyScoresState, weeklyScore) => {
            const week = moment(weeklyScore.week).format(Constants.DATE_FORMAT);
            prev[week] = weeklyScore.tasks.reduce(
              (prev2: { [task: string]: { [date: string]: number } }, task) => {
                prev2[task] = weeklyScore.scores.filter(s => s.task === task).reduce(
                  (prev3: { [date: string]: number }, score: Score) => {
                    const date = moment(score.date).format(Constants.DATE_FORMAT);
                    prev3[date] = score.value;
                    return prev3;
                  },
                  {});
                return prev2;
              },
              {});
            return prev;
          },
          {});

        if (!state[payload.child.id]) {
          return {
            ...Object.keys(state).reduce(
              (acc: ChildrenState, key) => {
                acc[key] = {
                  ...state[key],
                  isCurrent: false
                };
                return acc;
              },
              {}),
            [payload.child.id]: {
              isCurrent: true,
              child: payload.child,
              weeklyScores
            }
          } as ChildrenState;
        } else {
          const mergedWeeklyScores = { ...state[payload.child.id].weeklyScores, ...weeklyScores };
          const sortedWeeklyScores = Object.keys(mergedWeeklyScores).sort().reverse()
            .reduce(
            (prev: WeeklyScoresState, week: string) => {
              prev[week] = mergedWeeklyScores[week];
              return prev;
            },
            {});
          return {
            ...state,
            [payload.child.id]: {
              ...state[payload.child.id],
              child: payload.child,
              weeklyScores: sortedWeeklyScores
            }
          } as ChildrenState;
        }
      }
    case SWITCH_CHILD: {
      const childId = action.payload as string;
      if (state[childId] && !state[childId].isCurrent) {
        return Object.keys(state).reduce(
          (acc: ChildrenState, key) => {
            acc[key] = {
              ...state[key],
              isCurrent: childId === key ? true : false
            };
            return acc;
          },
          {});
      }
      return state;
    }
    case DELETE_CHILD:
      {
        const childId = action.payload as string;
        let flag = state[childId] && state[childId].isCurrent ? true : false;
        return Object.keys(state)
          .filter(key => key !== childId)
          .reduce(
          (result: ChildrenState, key: string) => {
            result[key] = { ...state[key], isCurrent: flag };
            flag = false;
            return result;
          },
          {}) as ChildrenState;
      }
    case UPDATE_SCORE:
      {
        const payload = action.payload as UpdateScorePayload;
        const childState = state[payload.childId];
        const week = moment(payload.date).day(0).format(Constants.DATE_FORMAT);
        const currentValue = childState.weeklyScores[week][payload.task][payload.date] || 0;
        const newTotal = childState.child.totalScore - currentValue + payload.value;
        return {
          ...state,
          [payload.childId]: {
            ...childState,
            child: {
              ...childState.child,
              totalScore: newTotal
            },
            weeklyScores: {
              ...childState.weeklyScores,
              [week]: {
                ...childState.weeklyScores[week],
                [payload.task]: {
                  ...childState.weeklyScores[week][payload.task],
                  [payload.date]: payload.value
                }
              }
            }
          }
        } as ChildrenState;
      }
    case ADD_REDEEMS:
      {
        const payload = action.payload as AddRedeemsPayload;
        const sortedRedeems = [...state[payload.childId].redeems, ...payload.redeems]
          .sort((a: Redeem, b: Redeem) => {
            return moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf();
          });
        return {
          ...state,
          [payload.childId]: {
            ...state[payload.childId],
            child: {
              ...state[payload.childId].child,
              totalScore: payload.updateTotal ?
                payload.redeems.reduce(
                  (prev: number, i: Redeem) => prev - i.value,
                  state[payload.childId].child.totalScore
                ) : state[payload.childId].child.totalScore
            },
            redeems: sortedRedeems
          }
        } as ChildrenState;
      }
    case CLEAR_TOKEN:
      {
        return INITIAL_STATE.children;
      }
    default:
      return state;
  }
}

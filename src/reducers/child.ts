import moment from 'moment';

import { CLEAR_TOKEN, ClearTokenAction } from '../actions/auth';
import {
  ADD_REDEEMS,
  AddRedeemsAction,
  DELETE_CHILD,
  DeleteChildAction,
  LOAD_CHILDREN,
  LoadChildrenAction,
  SET_SCORE,
  SetScoreAction,
  SWITCH_CHILD,
  SwitchChildAction,
  UPDATE_CHILD,
  UpdateChildAction
} from '../actions/child';

import * as Constants from '../constants';
import { Child, Redeem, Score } from '../types/api';
import { ChildrenState, WeeklyScoresState } from '../types/states';
import { INITIAL_STATE } from './initialState';

// tslint:disable-next-line:max-func-body-length
export default function (
  state: ChildrenState = INITIAL_STATE.children,
  action: LoadChildrenAction |
    UpdateChildAction |
    DeleteChildAction |
    SwitchChildAction |
    SetScoreAction |
    AddRedeemsAction |
    ClearTokenAction): ChildrenState {
  switch (action.type) {
    case LOAD_CHILDREN: {
      const children = action.payload;
      return children.reduce(
        (prev: ChildrenState, child: Child) => {
          prev[child.id] = {
            isCurrent: false,
            child,
            weeklyScores: {},
            redeems: []
          };
          return prev;
        },
        {});
    }
    case UPDATE_CHILD:
      {
        const payload = action.payload;
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
            ...state,
            [payload.child.id]: {
              isCurrent: false,
              child: payload.child,
              weeklyScores,
              redeems: []
            }
          };
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
          };
        }
      }
    case SWITCH_CHILD: {
      const childId = action.payload;
      if (childId && state[childId] && !state[childId].isCurrent) {
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
        const childId = action.payload;
        const newState = Object.assign({}, state);
        delete newState[childId];
        return newState;
      }
    case SET_SCORE:
      {
        const payload = action.payload;
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
        };
      }
    case ADD_REDEEMS:
      {
        const payload = action.payload;
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
        };
      }
    case CLEAR_TOKEN:
      {
        return INITIAL_STATE.children;
      }
    default:
      return state;
  }
}

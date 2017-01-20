/* @flow */

import update from 'react-addons-update';
import moment from 'moment';
import { ADD_CHILDREN, UPDATE_CHILD, DELETE_CHILD, UPDATE_SCORE, ADD_REDEEMS } from '../actions/child';
import { CLEAR_TOKEN } from '../actions/auth';

import { INITIAL_STATE } from './initialState';

import type { ChildrenState, WeeklyScoresState } from '../types/states.flow';
import type { Action, UpdateScorePayload, AddRedeemsPayload } from '../types/actions.flow';

export default function (state: ChildrenState = INITIAL_STATE.children, action: Action<any, any>) {
  switch (action.type) {
    case ADD_CHILDREN: {
      const children: Child[] = action.payload;
      return children.reduce((prev: ChildrenState, child: Child) => {
        prev[child.id] = {
          child: child,
          weeklyScores: {},
          redeems: []
        };
        return prev;
      }, {});
    }
    case UPDATE_CHILD:
      {
        const payload: ScoreResult = action.payload;
        const weeklyScores: WeeklyScoresState = payload.weeklyScores
          .sort((a: WeeklyScore, b: WeeklyScore) => {
            return a.week < b.week ? 1 : a.week > b.week ? -1 : 0;
          })
          .reduce((prev: WeeklyScoresState, weeklyScore: WeeklyScore) => {
            const week = moment(Date.parse(weeklyScore.week)).utc().format('YYYY-MM-DD');
            prev[week] = weeklyScore.tasks.reduce((prev: { [task: string]: { [date: string]: number } }, task: string) => {
              prev[task] = weeklyScore.scores.filter(s => s.task == task).reduce((prev: { [date: string]: number }, score: Score) => {
                const date = moment(Date.parse(score.date)).utc().format('YYYY-MM-DD');
                prev[date] = score.value;
                return prev;
              }, {});
              return prev;
            }, {});
            return prev;
          }, {});

        if (state.isNotLoaded) {
          return {
            [payload.child.id]: {
              child: payload.child,
              weeklyScores: weeklyScores
            }
          };
        }
        else if (!state[payload.child.id]) {
          return update(state, {
            $merge: {
              [payload.child.id]: {
                child: payload.child,
                weeklyScores: weeklyScores
              }
            }
          });
        } else {
          const mergedWeeklyScores: WeeklyScoresState = update(state[payload.child.id].weeklyScores, { $merge: weeklyScores });
          const sortedWeeklyScores: WeeklyScoresState = Object.keys(mergedWeeklyScores).sort().reverse()
            .reduce((prev: WeeklyScoresState, week: string) => {
              prev[week] = mergedWeeklyScores[week];
              return prev;
            }, {});
          return update(state, {
            [payload.child.id]: {
              child: { $set: payload.child },
              weeklyScores: { $set: sortedWeeklyScores }
            }
          });
        }
      }
    case DELETE_CHILD:
      {
        const childId: string = action.payload;
        const newState: ChildrenState = Object.keys(state).filter(key => key !== childId).reduce((result: ChildrenState, key: string) => {
          result[key] = state[key];
          return result;
        }, {});
        return newState;
      }
    case UPDATE_SCORE:
      {
        const payload: UpdateScorePayload = action.payload;
        const week = moment(Date.parse(payload.date)).utc().day(0).utc().format('YYYY-MM-DD');
        const currentValue = state[payload.childId].weeklyScores[week][payload.task][payload.date] || 0;
        return update(state, {
          [payload.childId]: {
            child: {
              totalScore: { $apply: (x: number) => { return x - currentValue + payload.value; } }
            },
            weeklyScores: {
              [week]: {
                [payload.task]: { $merge: { [payload.date]: payload.value } }
              }
            }
          }
        });
      }
    case CLEAR_TOKEN:
      {
        return INITIAL_STATE.children;
      }
    case ADD_REDEEMS:
      {
        const payload: AddRedeemsPayload = action.payload;
        const sortedRedeems = update(state[payload.childId].redeems, { $push: payload.redeems }).sort((a: Redeem, b: Redeem) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        return update(state, {
          [payload.childId]: {
            child: {
              totalScore: {
                $apply: (x: number) => {
                  return payload.updateTotal ? payload.redeems.reduce((prev: number, i: Redeem) => { return prev - i.value; }, x) : x;
                }
              }
            },
            redeems: { $set: sortedRedeems }
          }
        });
      }
    default:
      return state;
  }
}


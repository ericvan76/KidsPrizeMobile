import moment from 'moment';

import { CLEAR_TOKEN, ClearTokenAction } from '../actions/auth';
import {
  DELETE_CHILD,
  DeleteChildAction,
  SWITCH_CHILD,
  SwitchChildAction,
  UPDATE_CHILD,
  UpdateChildAction
} from '../actions/children';
import { UPDATE_REDEEMS, UpdateRedeemsAction } from '../actions/redeems';
import { SET_SCORE, SetScoreAction, UPDATE_SCORES, UpdateScoresAction } from '../actions/scores';
import { DATE_FORMAT } from '../constants';
import { Redeem, Score } from '../types/api';
import { ChildrenState, TaskRow, WeeklyState } from '../types/states';
import { INITIAL_STATE } from './initialState';

// tslint:disable-next-line:max-func-body-length
export default function (
  state: ChildrenState = INITIAL_STATE.children,
  action:
    UpdateChildAction | SwitchChildAction | DeleteChildAction | ClearTokenAction |
    UpdateScoresAction | SetScoreAction |
    UpdateRedeemsAction): ChildrenState {
  switch (action.type) {
    case UPDATE_CHILD:
      {
        const child = action.payload;
        const childState = state.get(action.payload.id);
        const newChildState = childState ? {
          ...childState,
          child
        } : {
            isCurrent: false,
            child,
            scores: new Map<string, WeeklyState>(),
            redeems: Array<Redeem>()
          };
        return new Map(state).set(child.id, newChildState);
      }
    case SWITCH_CHILD:
      {
        const childId = action.payload;
        if (childId) {
          const childState = state.get(childId);
          if (childState && !childState.isCurrent) {
            const newState = new Map(state);
            newState.forEach(c => {
              if (c.child.id === childId) {
                c.isCurrent = true;
              } else if (c.isCurrent) {
                c.isCurrent = false;
              }
            });
            return newState;
          }
        }
        return state;
      }
    case DELETE_CHILD:
      {
        const childId = action.payload;
        const newState = new Map(state);
        if (newState.delete(childId)) {
          return newState;
        }
        return state;
      }
    case CLEAR_TOKEN:
      {
        return INITIAL_STATE.children;
      }

    case UPDATE_SCORES:
      {
        const payload = action.payload;
        const updatedScores = new Map(
          payload.weeklyScores.map(ws =>
            [
              ws.week,
              new Map(ws.tasks.map(t =>
                [
                  t,
                  ws.scores.filter(s => s.task.toLowerCase() === t.toLowerCase())
                ] as [string, TaskRow]
              ))
            ] as [string, WeeklyState]
          )
        );
        const childState = state.get(payload.childId);
        if (childState) {
          const merged = new Map(childState.scores);
          updatedScores.forEach((v, k) => merged.set(k, v));
          const sorted = new Map(Array.from(merged.entries()).sort((a, b) => moment(b[0]).valueOf() - moment(a[0]).valueOf()));
          return new Map(state).set(payload.childId, {
            ...childState,
            scores: sorted
          });
        }
        return state;
      }
    case SET_SCORE:
      {
        const payload = action.payload;
        const childState = state.get(payload.childId);
        if (childState) {
          const week = moment(payload.date).day(0).format(DATE_FORMAT);
          const weekState = childState.scores.get(week);
          if (weekState) {
            const taskRow = weekState.get(payload.task);
            if (taskRow) {
              const newScore: Score = {
                task: payload.task,
                date: payload.date,
                value: payload.value
              };
              const newTaskRow = [...taskRow.filter(s => s.date !== payload.date), newScore];
              const newWeekState = new Map(weekState).set(payload.task, newTaskRow);
              const newChildState = {
                ...childState,
                scores: new Map(childState.scores).set(week, newWeekState)
              };
              return new Map(state).set(payload.childId, newChildState);
            }
          }
        }
        return state;
      }
    case UPDATE_REDEEMS:
      {
        const payload = action.payload;
        const childState = state.get(payload.childId);
        if (childState) {
          const sortedRedeems = [...childState.redeems, ...payload.redeems]
            .sort((a: Redeem, b: Redeem) => {
              return moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf();
            });
          const newChildState = {
            ...childState,
            redeems: sortedRedeems
          };
          return new Map(state).set(payload.childId, newChildState);
        }
        return state;
      }
    default:
      return state;
  }
}

import moment from 'moment';
import * as actions from 'src/actions/child';
import { ChildId, Redeem, WeekId, WeeklyScore } from 'src/api/child';
import * as Constants from 'src/constants';
import { ChildState } from 'src/store';
import { INITIAL_STATE } from './initialState';

// tslint:disable-next-line:max-func-body-length
export function childrenReducer(
  state: Record<ChildId, ChildState> = INITIAL_STATE.children,
  action:
    typeof actions.updateChild.shape |
    typeof actions.removeChild.shape |
    typeof actions.updateScores.shape |
    typeof actions.setScore.shape |
    typeof actions.updateRedeems.shape |
    typeof actions.reset.shape
): Record<ChildId, ChildState> {
  switch (action.type) {
    case actions.updateChild.type: {
      const child = action.payload;
      const childId = child.id;
      const childState = state[childId] !== undefined ?
        {
          ...state[childId],
          child
        } : {
          child,
          scores: {},
          redeems: {}
        };
      return {
        ...state,
        [childId]: childState
      };
    }
    case actions.removeChild.type: {
      const childId = action.payload;
      const newState = { ...state };
      delete newState[childId];
      return newState;
    }
    case actions.updateScores.type: {
      const { child, weeklyScores } = action.payload;
      const childId = child.id;
      const childState: ChildState = state[childId] || { child, scores: {}, redeems: {} };
      const scores: Record<WeekId, WeeklyScore> = weeklyScores.reduce(
        (p: Record<WeekId, WeeklyScore>, c: WeeklyScore) => {
          p[c.week] = c;
          return p;
        },
        {});
      return {
        ...state,
        [childId]: {
          ...childState,
          child,
          scores: {
            ...childState.scores,
            ...scores
          }
        }
      };
    }
    case actions.setScore.type: {
      const { childId, task, date, value } = action.payload;
      const childState: ChildState = state[childId];
      const weekId = moment(`${date}T00:00:00Z`).day(0).format(Constants.DATE_FORMAT);
      if (childState.scores === undefined) {
        return state;
      }
      const weeklyScore = childState.scores[weekId];
      const newScores = weeklyScore.scores
        .filter(i => i.task !== task || i.date !== date)
        .concat({ task, date, value });
      return {
        ...state,
        [childId]: {
          ...childState,
          scores: {
            ...childState.scores,
            [weekId]: {
              ...weeklyScore,
              scores: newScores
            }
          }
        }
      };
    }
    case actions.updateRedeems.type: {
      const { child, redeems } = action.payload;
      const childId = child.id;
      const childState = state[childId];

      const redeemsMap = redeems.reduce(
        (prev: Record<string, Redeem>, cur: Redeem) => {
          prev[cur.timestamp] = cur;
          return prev;
        },
        {}
      );
      return {
        ...state,
        [childId]: {
          ...childState,
          child,
          redeems: {
            ...childState.redeems,
            ...redeemsMap
          }
        }
      };
    }
    case actions.reset.type: {
      return INITIAL_STATE.children;
    }
    default:
      return state;
  }
}

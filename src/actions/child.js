
import * as api from '../api/mock';
import dateUtil from '../utils/dateUtil';

export const ADD_CHILD: string = 'ADD_CHILD';
export const REMOVE_CHILD: string = 'REMOVE_CHILD';
export const SWITCH_CHILD: string = 'SWITCH_CHILD';
export const UPDATE_SCORES: string = 'UPDATE_SCORES';


export function loadChildren() {
  return async (dispatch: Dispatch) => {
    const children = await api.listChild();
    children.forEach(child => {
      dispatch({
        type: ADD_CHILD,
        id: child.id,
        name: child.name,
        gender: child.gender,
        tasks: child.tasks
      });
      dispatch(refresh(child.id));
    });
  };
}

export function addChild(id: string, name: string, gender: string, tasks: string[]) {
  return (dispatch) => {
    api.addChild(id, name, gender, tasks).then(child => {
      dispatch({
        type: ADD_CHILD,
        id: child.id,
        name: child.name,
        gender: child.gender,
        tasks: child.tasks
      });
      dispatch(refresh(id));
    });
  };
}

export function removeChild(id) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.currentChildId === id) {
      const replace = state.children.find(c => c.id !== id);
      dispatch({
        type: SWITCH_CHILD,
        id: replace.id
      });
    }
    api.removeChild(id).then(() => {
      dispatch({
        type: REMOVE_CHILD,
        id: id
      });
    });
  };
}

export function switchChild(id) {
  return {
    type: SWITCH_CHILD,
    id: id
  };
}

export function refresh(childId) {
  return (dispatch) => {
    const nextWeek = dateUtil.addDays(dateUtil.thisWeek(), 7).toISOString();
    api.fetchScores(childId, nextWeek, 28).then(result => {
      dispatch({
        type: UPDATE_SCORES,
        childId: result.childId,
        total: result.total,
        days: result.days
      });
    });
  };
}

export function fetchMore(childId) {
  return (dispatch, getState) => {
    const state = getState();
    const scores = state.scores[childId];
    if (scores.earliest !== undefined) {
      api.fetchScores(childId, scores.earliest, 28).then(result => {
        dispatch({
          type: UPDATE_SCORES,
          childId: result.childId,
          total: result.total,
          days: result.days
        });
      });
    }
  };
}

export function setScore(childId, date, task, value) {
  return (dispatch) => {
    api.setScore(childId, date, task, value).then(result => {
      dispatch({
        type: UPDATE_SCORES,
        childId: result.childId,
        total: result.total,
        days: result.days
      });
    });
  };
}

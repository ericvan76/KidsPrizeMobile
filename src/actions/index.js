import * as api from '../api/mock';
import dateUtil from '../utils/dateUtil';

export const UPDATE_USER = 'UPDATE_USER';
export const ADD_CHILD = 'ADD_CHILD';
export const REMOVE_CHILD = 'REMOVE_CHILD';
export const SWITCH_CHILD = 'SWITCH_CHILD';
export const UPDATE_SCORES = 'UPDATE_SCORES';

export const initialise = () => {
  return (dispatch) => {
    Promise.all([api.getUserInfo(), api.listChild()]).then(([user, children]) => {
      dispatch({
        type: UPDATE_USER,
        user: user
      });
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
    });
  };
};

export const addChild = (id, name, gender, tasks) => {
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
};

export const removeChild = (id) => {
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
};

export const switchChild = (id) => {
  return {
    type: SWITCH_CHILD,
    id: id
  };
};

export const refresh = (childId) => {
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
};

export const fetchMore = (childId) => {
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
};

export const setScore = (childId, date, task, value) => {
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
};
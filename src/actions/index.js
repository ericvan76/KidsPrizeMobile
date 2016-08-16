import * as api from '../api/mock';
import * as dateUtil from '../common/dateUtil';

export const UPDATE_USER = 'UPDATE_USER';
export const ADD_CHILD = 'ADD_CHILD';
export const REMOVE_CHILD = 'REMOVE_CHILD';
export const SWITCH_CHILD = 'SWITCH_CHILD';
export const UPDATE_SCORES = 'UPDATE_SCORES';

export const initialise = () => {
  return (dispatch) => {
    Promise.all([api.getUserInfo(), api.listChild()]).then(([user, children]) => {
      dispatch({type: UPDATE_USER, user: user});
      children.forEach(child => {
        dispatch({type: ADD_CHILD, child: child});
      });
      if (children.length > 0) {
        dispatch(switchChild(children[0].id));
      }
    });
  };
};

export const addChild = (id, name, gender) => {
  return (dispatch) => {
    api.addChild(id, name, gender).then(child => {
      dispatch({type: ADD_CHILD, child: child});
      dispatch(switchChild(id));
    });
  };
};

export const removeChild = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.user.currentChildId === id) {
      const replace = state.children.find(c => c.id !== id);
      dispatch(switchChild(replace.id));
    }
    api.removeChild(id).then(() => {
      dispatch({type: REMOVE_CHILD, id: id});
    });
  };
};

export const switchChild = (id) => {
  return (dispatch, getState) => {
    dispatch({type: SWITCH_CHILD, id: id});
    const state = getState();
    if (Object.keys(state.children[id].days).length === 0) {
      dispatch(refresh(id));
    }
  };
};

export const refresh = (childId) => {
  return (dispatch) => {
    const nextWeek = dateUtil.addDays(dateUtil.thisWeek(), 7).toISOString();
    api.fetchScores(childId, nextWeek, 28).then(result => {
      dispatch({type: UPDATE_SCORES, scores: result});
    });
  };
};

export const fetchMore = (childId) => {
  return (dispatch, getState) => {
    const state = getState();
    const child = state.children[childId];
    if (child.earliest !== undefined) {
      api.fetchScores(childId, child.earliest, 28).then(result => {
        dispatch({type: UPDATE_SCORES, scores: result});
      });
    }
  };
};

export const setScore = (childId, date, task, value) => {
  return (dispatch) => {
    api.setScore(childId, date, task, value).then(result => {
      dispatch({type: UPDATE_SCORES, scores: result});
    });
  };
};

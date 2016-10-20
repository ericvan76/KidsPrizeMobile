import * as api from '../api/mock';
import oidc from '../api/oidc';
import storage from '../api/storage';
import dateUtil from '../utils/dateUtil';
import * as Types from './ActionTypes';


export const initialise = () => {
  return (dispatch) => {
    Promise.all([oidc.discover(), storage.loadToken()])
      .then(([discovery, token]) => {
        dispatch({
          type: Types.INITIALISED,
          discovery: discovery,
          token: token
        });
      });
  };
};

export const requestToken = (code) => {
  return (dispatch) => {
    oidc.requestToken(code)
      .then(token => {
        if (!token.error) {
          storage.saveToken(token);
          return token;
        }
        throw token.error;
      })
      .then(token => {
        dispatch({
          type: Types.SIGN_IN,
          token: token
        });
      });
  };
};

export const signout = () => {
  return (dispatch, getState) => {
    let state = getState();
    storage.clearToken()
      .then(() => {
        oidc.logout(state.auth.token);
      })
      .then(() => {
        dispatch({
          type: Types.SIGN_OUT
        });
      });
  };
};

export const loadChildren = () => {
  return (dispatch) => {
    Promise.all([api.getUserInfo(), api.listChild()])
      .then(([user, children]) => {
        dispatch({
          type: Types.SET_USER,
          user: user
        });
        children.forEach(child => {
          dispatch({
            type: Types.ADD_CHILD,
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
        type: Types.ADD_CHILD,
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
        type: Types.SWITCH_CHILD,
        id: replace.id
      });
    }
    api.removeChild(id).then(() => {
      dispatch({
        type: Types.REMOVE_CHILD,
        id: id
      });
    });
  };
};

export const switchChild = (id) => {
  return {
    type: Types.SWITCH_CHILD,
    id: id
  };
};

export const refresh = (childId) => {
  return (dispatch) => {
    const nextWeek = dateUtil.addDays(dateUtil.thisWeek(), 7).toISOString();
    api.fetchScores(childId, nextWeek, 28).then(result => {
      dispatch({
        type: Types.UPDATE_SCORES,
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
          type: Types.UPDATE_SCORES,
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
        type: Types.UPDATE_SCORES,
        childId: result.childId,
        total: result.total,
        days: result.days
      });
    });
  };
};
import update from 'react-addons-update';

import * as actions from '../actions/child';

const children = (state = {}, action) => {
  switch (action.type) {
    case actions.ADD_CHILD:
      {
        return update(state, {
          $merge: {
            [action.id]: {
              id: action.id,
              name: action.name,
              gender: action.gender,
              tasks: action.tasks
            }
          }
        });
      }
    case actions.REMOVE_CHILD:
      {
        return Object.keys(state).filter(key => key !== action.id).reduce((result, key) => {
          result[key] = state[key];
          return result;
        }, {});
      }
    case actions.SIGN_OUT:
      {
        return {};
      }
    default:
      return state;
  }
};

export default children;
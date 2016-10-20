import update from 'react-addons-update';

import * as Types from '../actions/ActionTypes';

const children = (state = {}, action) => {
  switch (action.type) {
    case Types.ADD_CHILD:
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
    case Types.REMOVE_CHILD:
      {
        return Object.keys(state).filter(key => key !== action.id).reduce((result, key) => {
          result[key] = state[key];
          return result;
        }, {});
      }
    case Types.SIGN_OUT:
      {
        return {};
      }
    default:
      return state;
  }
};

export default children;
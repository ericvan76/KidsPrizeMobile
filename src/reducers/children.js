import update from 'react-addons-update';

import { ADD_CHILD, REMOVE_CHILD } from '../actions';

const children = (state = {}, action) => {
  switch (action.type) {
    case ADD_CHILD:
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
    case REMOVE_CHILD:
      {
        return Object.keys(state).filter(key => key !== action.id).reduce((result, key) => {
          result[key] = state[key];
          return result;
        }, {});
      }
    default:
      return state;
  }
};

export default children;
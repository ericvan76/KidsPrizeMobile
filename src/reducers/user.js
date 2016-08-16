import {UPDATE_USER, SWITCH_CHILD} from '../actions';
import update from 'react-addons-update';

export default(state = {}, action) => {
  switch (action.type) {
    case UPDATE_USER:
      {
        return action.user;
      }
    case SWITCH_CHILD:
      {
        return update(state, {
          currentChildId: {
            $set: action.id
          }
        });
      }
    default:
      return state;
  }
};

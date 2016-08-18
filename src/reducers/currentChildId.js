import {SWITCH_CHILD, ADD_CHILD, REMOVE_CHILD} from '../actions';

const currentChildId = (state = null, action) => {
  switch (action.type) {
    case SWITCH_CHILD:
      {
        return action.id;
      }
    case ADD_CHILD:
      {
        return action.id;
      }
    case REMOVE_CHILD:
      {
        return null;
      }
    default:
      return state;
  }
};

export default currentChildId;

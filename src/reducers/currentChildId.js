import * as Types from '../actions/ActionTypes';

const currentChildId = (state = null, action) => {
  switch (action.type) {
    case Types.SWITCH_CHILD:
      {
        return action.id;
      }
    case Types.ADD_CHILD:
      {
        return action.id;
      }
    case Types.REMOVE_CHILD:
      {
        return null;
      }
    case Types.SIGN_OUT:
      {
        return null;
      }
    default:
      return state;
  }
};

export default currentChildId;
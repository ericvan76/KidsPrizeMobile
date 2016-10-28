import * as actions from '../actions/child';

const currentChildId = (state = null, action) => {
  switch (action.type) {
    case actions.SWITCH_CHILD:
      {
        return action.id;
      }
    case actions.ADD_CHILD:
      {
        return action.id;
      }
    case actions.REMOVE_CHILD:
      {
        return null;
      }
    case actions.SIGN_OUT:
      {
        return null;
      }
    default:
      return state;
  }
};

export default currentChildId;
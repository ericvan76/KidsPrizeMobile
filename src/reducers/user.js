import * as Types from '../actions/ActionTypes';

const user = (state = null, action) => {
  switch (action.type) {
    case Types.SET_USER:
      {
        return action.user;
      }
    case Types.SIGN_OUT:
      {
        return null;
      }
    default:
      return state;
  }
};

export default user;
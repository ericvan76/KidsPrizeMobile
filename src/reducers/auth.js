import update from 'react-addons-update';

import * as Types from '../actions/ActionTypes';

const auth = (state = {}, action) => {

  switch (action.type) {
    case Types.INITIALISED:
      {
        return update(state, {
          initialised: { $set: true },
          discovery: { $set: action.discovery },
          token: { $set: action.token }
        });
      }
    case Types.SIGN_IN:
      {
        return update(state, {
          token: { $set: action.token }
        });
      }
    case Types.SIGN_OUT:
      {
        return update(state, {
          token: { $set: null }
        });
      }
    default:
      return state;
  }
};

export default auth;
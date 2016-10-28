/* @flow */
import update from 'react-addons-update';
import * as actions from '../actions/auth';

type AuthState = {
  initialised: boolean,
  discovery?: Discovery,
  token?: Token,
  user?: User
}

export default function reducer(state: AuthState = {
  initialised: false
}, action: Action): AuthState {

  switch (action.type) {

    case actions.DISCOVERY_SUCCESS:
      {
        const discovery: Discovery = action.payload;
        return update(state, {
          initialised: { $set: state.token !== undefined },
          discovery: { $set: discovery }
        });
      }
    case actions.TOKEN_SUCCESS:
      {
        const token: Token = action.payload;
        return update(state, {
          initialised: { $set: state.discovery !== undefined },
          token: { $set: token }
        });
      }
    case actions.TOKEN_REVOKED:
      {
        return update(state, {
          token: { $set: null }
        });
      }
    case actions.USER_INFO:
      {
        const user: User = action.payload;
        return update(state, {
          user: { $set: user }
        });
      }
    default:
      return state;
  }
}
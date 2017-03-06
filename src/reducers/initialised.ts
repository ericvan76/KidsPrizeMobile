import { CLEAR_TOKEN, ClearTokenAction } from '../actions/auth';
import { SET_INITIALISED, SetInitialisedAction } from '../actions/children';
import { INITIAL_STATE } from './initialState';

export default function (
  state: boolean = INITIAL_STATE.initialised,
  action: SetInitialisedAction | ClearTokenAction) {
  switch (action.type) {
    case SET_INITIALISED:
      return action.payload;
    case CLEAR_TOKEN:
      return INITIAL_STATE.initialised;
    default:
      return state;
  }
}

import { SET_INITIALISED, SetInitialisedAction } from '../actions/child';
import { INITIAL_STATE } from './initialState';

export default function (
  state: boolean = INITIAL_STATE.initialised,
  action: SetInitialisedAction) {
  if (action.type === SET_INITIALISED) {
    return action.payload;
  }
  return state;
}

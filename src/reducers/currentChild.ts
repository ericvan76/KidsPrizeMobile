import * as actions from 'src/actions/child';
import { ChildId } from 'src/api/child';
import { INITIAL_STATE } from './initialState';

export function currentChildReducer(
  state: ChildId | null = INITIAL_STATE.currentChild,
  action:
    typeof actions.switchChild.shape |
    typeof actions.reset.shape
): ChildId | null {
  switch (action.type) {
    case actions.switchChild.type: {
      return action.payload;
    }
    case actions.reset.type: {
      return INITIAL_STATE.currentChild;
    }
    default:
      return state;
  }
}

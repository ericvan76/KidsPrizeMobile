import * as actions from 'src/actions/requestState';
import { RequestState } from 'src/store';
import { INITIAL_STATE } from './initialState';

export function requestStateReducer(
  state: RequestState = INITIAL_STATE.requestState,
  action:
    typeof actions.startRequesting.shape |
    typeof actions.endRequesting.shape |
    typeof actions.requestFailure.shape |
    typeof actions.clearErrors.shape
): RequestState {
  switch (action.type) {
    case actions.startRequesting.type: {
      return {
        ...state,
        requesting: {
          ...state.requesting,
          [action.payload]: true
        }
      };
    }
    case actions.endRequesting.type: {
      return {
        ...state,
        requesting: {
          ...state.requesting,
          [action.payload]: undefined
        }
      };
    }
    case actions.requestFailure.type: {
      const { actionType, error } = action.payload;
      return {
        ...state,
        requesting: {
          ...state.requesting,
          [actionType]: undefined
        },
        errors: {
          ...state.errors,
          [actionType]: error
        }
      };
    }
    case actions.clearErrors.type: {
      return {
        ...state,
        errors: {}
      };
    }
    default:
      return state;
  }
}

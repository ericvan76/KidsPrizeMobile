import { batchActions } from 'redux-batched-actions';

import * as api from '../api/api';
import { Action, AsyncAction } from '../types/actions';
import { Child, Gender } from '../types/api';
import { raiseError } from './errors';
import { updateScores } from './scores';

export const LOAD_CHILDREN = 'LOAD_CHILDREN';
export type LoadChildrenAction = Action<typeof LOAD_CHILDREN, Array<Child>>;
export function loadChildren(children: Array<Child>): LoadChildrenAction {
  return {
    type: LOAD_CHILDREN,
    payload: children
  };
}

export const SET_INITIALISED = 'SET_INITIALISED';
export type SetInitialisedAction = Action<typeof SET_INITIALISED, boolean>;
export function setInitialised(initialised: boolean): SetInitialisedAction {
  return {
    type: SET_INITIALISED,
    payload: initialised
  };
}

export const SWITCH_CHILD = 'SWITCH_CHILD';
export type SwitchChildAction = Action<typeof SWITCH_CHILD, string | undefined>;
export function switchChild(childId: string | undefined): SwitchChildAction {
  return {
    type: SWITCH_CHILD,
    payload: childId
  };
}

export const DELETE_CHILD = 'DELETE_CHILD';
export type DeleteChildAction = Action<typeof DELETE_CHILD, string>;
export function deleteChild(childId: string): DeleteChildAction {
  return {
    type: DELETE_CHILD,
    payload: childId
  };
}

export const UPDATE_CHILD = 'UPDATE_CHILD';
export type UpdateChildAction = Action<typeof UPDATE_CHILD, Child>;
export function updateChild(child: Child): UpdateChildAction {
  return {
    type: UPDATE_CHILD,
    payload: child
  };
}

// Async Actions
export function loadChildrenAsync(): AsyncAction {
  return async (dispatch) => {
    try {
      // todo: implement preference state
      await api.setPreference({
        timeZoneOffset: new Date().getTimezoneOffset()
      });
      const children: Array<Child> = await api.listChildren();
      dispatch(batchActions([
        ...children.map(c => updateChild(c)),
        switchChild(children.length > 0 ? children[0].id : undefined),
        setInitialised(true)
      ]));
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function createChildAsync(childId: string, name: string, gender: Gender, tasks: Array<string>): AsyncAction {
  return async (dispatch) => {
    try {
      const result = await api.createChild(childId, name, gender, tasks);
      dispatch(batchActions([
        updateChild(result.child),
        updateScores(childId, result.weeklyScores),
        switchChild(result.child.id)
      ]));
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function updateChildAsync(childId: string, name: string, gender: Gender, tasks: Array<string>): AsyncAction {
  return async (dispatch) => {
    try {
      const result = await api.updateChild(childId, name, gender, tasks);
      dispatch(batchActions([
        updateChild(result.child),
        updateScores(childId, result.weeklyScores)
      ]));
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

export function deleteChildAsync(childId: string): AsyncAction {
  return async (dispatch, getState) => {
    try {
      await api.deleteChild(childId);
      const nextChildId = [...getState().children.keys()].find(k => k !== childId);
      dispatch(batchActions([
        deleteChild(childId),
        switchChild(nextChildId)
      ]));
    } catch (err) {
      dispatch(raiseError(err));
    }
  };
}

/* @flow */

import * as uuid from 'uuid';

import { clearToken } from '../actions/auth';
import { addChildren, switchChild, deleteChild } from '../actions/child';
import reducer from './currentChild';


describe('reducers', () => {
  describe('currentChild', () => {
    it('test add children', () => {
      const childId = uuid.v4();
      const initState = null;
      const state: ?string = reducer(initState, addChildren([
        { id: childId, name: 'C1', gender: 'M', totalScore: 0 },
        { id: uuid.v4(), name: 'C2', gender: 'F', totalScore: 0 },
      ]));
      expect(state).toBeTruthy();
      expect(state).toBe(childId);
    });
    it('test switch child', () => {
      const initState = uuid.v4();
      const newChild = uuid.v4();
      const state = reducer(initState, switchChild(newChild));
      expect(state).toEqual(newChild);
    });
    it('test delete child', () => {
      const initState = uuid.v4();
      const state = reducer(initState, deleteChild(uuid.v4()));
      expect(state).toEqual(initState);
    });
    it('test delete current child', () => {
      const initState = uuid.v4();
      const state = reducer(initState, deleteChild(initState));
      expect(state).toBeNull();
    });
    it('test clear token', () => {
      const initState = uuid.v4();
      const state = reducer(initState, clearToken());
      expect(state).toBeNull();
    });

  });
});
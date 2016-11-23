/* @flow */

import * as uuid from 'uuid';

import { clearToken } from '../actions/auth';
import { switchChild, deleteChild } from '../actions/child';
import reducer from './currentChild';


describe('reducers', () => {
  describe('currentChild', () => {

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
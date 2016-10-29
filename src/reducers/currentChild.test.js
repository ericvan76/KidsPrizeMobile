/* @flow */

import * as uuid from 'uuid';

import { clearToken } from '../actions/auth';
import { switchChild } from '../actions/child';
import reducer from './currentChild';


describe('reducers', () => {
  describe('currentChild', () => {

    it('test switch child', () => {
      const initState = uuid.v4();
      const newChild = uuid.v4();
      const state = reducer(initState, switchChild(newChild));
      expect(state).toEqual(newChild);
    });

    it('test clear token', () => {
      const initState = uuid.v4();
      const state = reducer(initState, clearToken());
      expect(state).toBeNull();
    });

  });
});
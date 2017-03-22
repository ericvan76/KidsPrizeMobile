import * as uuid from 'uuid';

import { clearToken } from '../actions/auth';
import {
  deleteChild,
  switchChild,
  updateChild
} from '../actions/children';
import { GENDER_FEMALE, GENDER_MALE } from '../constants';
import ChildStateBuilder from '../test/childStateBuilder';
import { Child } from '../types/api';
import { ChildrenState, ChildState } from '../types/states';
import reducer from './children';

describe('reducers', () => {
  describe('children', () => {

    it('test add 1st child', () => {
      const initState = new Map<string, ChildState>();
      const child: Child = {
        id: uuid.v4(),
        name: 'Child1',
        gender: GENDER_FEMALE,
        totalScore: 0
      };
      const state = reducer(initState, updateChild(child));
      const expected = state.get(child.id);
      expect(expected).toBeTruthy();
      if (expected) {
        expect(expected.child).toEqual(child);
        expect(expected.isCurrent).toBe(false);
        expect(expected.scores.size).toBe(0);
        expect(expected.redeems.length).toBe(0);
      }
    });

    it('test add 2nd child', () => {
      const childId = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId, new ChildStateBuilder()
        .withCurrent()
        .withChild(childId, 'Child1', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build());
      const childId2 = uuid.v4();
      const child2: Child = {
        id: childId2,
        name: 'Child2',
        gender: GENDER_FEMALE,
        totalScore: 0
      };
      const state = reducer(initState, updateChild(child2));
      expect(state.size).toBe(2);
      expect(state.get(childId)).toBeTruthy();
      expect(state.get(childId2)).toBeTruthy();
    });

    it('test update child', () => {
      const childId = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId, new ChildStateBuilder()
        .withCurrent()
        .withChild(childId, 'Child1', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build());
      const child: Child = {
        id: childId,
        name: 'Child2',
        gender: GENDER_FEMALE,
        totalScore: 0
      };
      const state = reducer(initState, updateChild(child));
      expect(state.size).toBe(1);
      expect(state.get(childId)).toBeTruthy();
    });
    it('test switch child', () => {
      const initState = new Map<string, ChildState>();
      const childId = uuid.v4();
      initState.set(childId, new ChildStateBuilder()
        .withCurrent()
        .withChild(childId, 'Child1', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build());
      const childId2 = uuid.v4();
      initState.set(childId2, new ChildStateBuilder()
        .withChild(childId2, 'Child2', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build());
      const state = reducer(initState, switchChild(childId2));
      expect(state.size).toBe(2);
      const child1 = state.get(childId);
      expect(child1).toBeTruthy();
      if (child1) {
        expect(child1.isCurrent).toBeFalsy();
      }
      const child2 = state.get(childId2);
      expect(child2).toBeTruthy();
      if (child2) {
        expect(child2.isCurrent).toBeTruthy();
      }
    });

    it('test delete child', () => {
      const childId1 = uuid.v4();
      const childId2 = uuid.v4();
      const childId3 = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId1, new ChildStateBuilder()
        .withChild(childId1, 'Child1', GENDER_FEMALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build());
      initState.set(childId2, new ChildStateBuilder()
        .withCurrent()
        .withChild(childId2, 'Child2', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-15', 'C', 1)
        .build());
      initState.set(childId3, new ChildStateBuilder()
        .withChild(childId3, 'Child2', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-15', 'C', 1)
        .build());
      const state = reducer(initState, deleteChild(childId2));
      expect(state).toBeTruthy();
      expect(state.size).toBe(2);
      expect(state.get(childId2)).toBeUndefined();
    });

    it('test clear token', () => {
      const childId = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId, new ChildStateBuilder()
        .withChild(childId, 'Child1', GENDER_FEMALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build()
      );
      const state: ChildrenState = reducer(initState, clearToken());
      expect(state.size).toBe(0);
    });

  });
});

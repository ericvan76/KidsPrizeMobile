import * as uuid from 'uuid';

import { updateRedeems } from '../actions/redeems';
import { GENDER_FEMALE } from '../constants';
import ChildStateBuilder from '../test/childStateBuilder';
import { ChildState } from '../types/states';
import reducer from './children';

describe('reducers', () => {
  describe('redeems', () => {

    it('test update redeems', () => {
      const childId = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId, new ChildStateBuilder()
        .withChild(childId, 'Child1', GENDER_FEMALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 10)
        .withRedeem('2017-01-01T05:00:00Z', 'x', 1)
        .withRedeem('2017-01-01T01:00:00Z', 'y', 1)
        .build()
      );

      const state = reducer(initState, updateRedeems(
        childId,
        [
          { timestamp: '2017-01-01T03:00:00Z', description: 'x', value: 1 },
          { timestamp: '2017-01-01T04:00:00Z', description: 'y', value: 1 },
          { timestamp: '2017-01-01T02:00:00Z', description: 'z', value: 1 }
        ])
      );

      const childState = state.get(childId);
      expect(childState).toBeTruthy();
      if (childState) {
        expect(childState.redeems.length).toBe(5);
        expect(childState.redeems[0].timestamp).toBe('2017-01-01T05:00:00Z');
        expect(childState.redeems[1].timestamp).toBe('2017-01-01T04:00:00Z');
        expect(childState.redeems[2].timestamp).toBe('2017-01-01T03:00:00Z');
        expect(childState.redeems[3].timestamp).toBe('2017-01-01T02:00:00Z');
        expect(childState.redeems[4].timestamp).toBe('2017-01-01T01:00:00Z');
      }
    });
  });
});

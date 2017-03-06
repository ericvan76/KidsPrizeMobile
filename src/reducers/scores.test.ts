import * as uuid from 'uuid';

import { setScore, updateScores } from '../actions/scores';
import { GENDER_FEMALE, GENDER_MALE } from '../constants';
import ChildStateBuilder from '../test/childStateBuilder';
import ScoreResultBuilder from '../test/scoreResultBuilder';
import { ChildState } from '../types/states';
import reducer from './children';

describe('reducers', () => {
  describe('scores', () => {

    it('test update scores', () => {
      const childId = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId, new ChildStateBuilder()
        .withChild(childId, 'Child1', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'A', 1)
        .withScore('2016-11-13', 'B', 1)
        .build());

      const scoreResult = new ScoreResultBuilder()
        .withChild(childId, 'Child2', GENDER_FEMALE)
        .withWeek('2016-11-13', ['B', 'C', 'D'])
        .withScore('2016-11-13', 'B', 1)
        .withScore('2016-11-13', 'C', 1)
        .withScore('2016-11-15', 'D', 1)
        .build();
      const state = reducer(initState, updateScores(childId, scoreResult.weeklyScores));
      const childState = state.get(childId);
      expect(childState).toBeTruthy();
      if (childState) {
        const expectWeek = childState.scores.get('2016-11-13');
        expect(expectWeek).toBeTruthy();
        if (expectWeek) {
          expect([...expectWeek.keys()]).toEqual(['B', 'C', 'D']);
        }
      }
    });

    it('test set score', () => {
      const childId = uuid.v4();
      const initState = new Map<string, ChildState>();
      initState.set(childId, new ChildStateBuilder()
        .withChild(childId, 'Child1', GENDER_MALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .withScore('2016-11-13', 'B', 1)
        .build());

      let state = reducer(initState, setScore(childId, '2016-11-14', 'C', 1));
      let childState = state.get(childId);
      expect(childState).toBeTruthy();
      if (childState) {
        const expectWeek = childState.scores.get('2016-11-13');
        expect(expectWeek).toBeTruthy();
        if (expectWeek) {
          const taskRow = expectWeek.get('C');
          expect(taskRow).toBeTruthy();
          if (taskRow) {
            expect(taskRow[0].date).toBe('2016-11-14');
            expect(taskRow[0].value).toBe(1);
          }
        }
      }
      state = reducer(state, setScore(childId, '2016-11-13', 'B', 0));
      childState = state.get(childId);
      expect(childState).toBeTruthy();
      if (childState) {
        const expectWeek = childState.scores.get('2016-11-13');
        expect(expectWeek).toBeTruthy();
        if (expectWeek) {
          const taskRow = expectWeek.get('B');
          expect(taskRow).toBeTruthy();
          if (taskRow) {
            expect(taskRow[0].date).toBe('2016-11-13');
            expect(taskRow[0].value).toBe(0);
          }
        }
      }
    });
  });
});

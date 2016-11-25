/* @flow */

import moment from 'moment';
import uuid from 'uuid';

import { clearToken } from '../actions/auth';
import { noChild, updateChild, deleteChild, updateScore } from '../actions/child';
import reducer from './child';
import type { ChildState, ChildrenState, WeeklySectionState, WeeklyScoresState } from '../types/states.flow';

describe('reducers', () => {
  describe('child', () => {
    it('test no child', () => {
      const initState = { isNotLoaded: true };
      const state: ChildrenState = reducer(initState, noChild());
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
    });

    it('test add 1st child', () => {
      const initState = { isNotLoaded: true };
      const childId = uuid.v4();
      const scoreResult = new ScoreResultBuilder()
        .withChild(childId, 'Child1', 'F')
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .build();
      const state: ChildrenState = reducer(initState, updateChild(scoreResult));
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].child).toEqual(scoreResult.child);
      const expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['A', 'B', 'C']);
      expect(Object.values(expectWeek)).toEqual([{}, {}, {}]);
    });

    it('test add 2nd child', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', 'M')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      const childId2 = uuid.v4();
      const scoreResult = new ScoreResultBuilder()
        .withChild(childId2, 'Child2', 'F')
        .withWeek('2016-11-13', ['B', 'C', 'D'])
        .withScore('2016-11-14', 'B', 1)
        .withScore('2016-11-15', 'C', 1)
        .build();
      const state: ChildrenState = reducer(initState, updateChild(scoreResult));
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].child).toEqual(initState[childId].child);
      let expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['A', 'B', 'C']);

      expect(state[childId2]).toBeTruthy();
      expect(state[childId2].child).toEqual(scoreResult.child);
      expectWeek = state[childId2].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['B', 'C', 'D']);
    });

    it('test update child', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', 'M')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'A', 1)
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      const scoreResult = new ScoreResultBuilder()
        .withChild(childId, 'Child2', 'F')
        .withWeek('2016-11-13', ['B', 'C', 'D'])
        .withScore('2016-11-13', 'B', 1)
        .withScore('2016-11-13', 'C', 1)
        .withScore('2016-11-15', 'D', 1)
        .build();
      let state: ChildrenState = reducer(initState, updateChild(scoreResult));
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].child).toEqual(scoreResult.child);
      const expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['B', 'C', 'D']);
    });

    it('test update score', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', 'M')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      let state: ChildrenState = reducer(initState, updateScore(childId, '2016-11-14', 'C', 1));
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].child.totalScore).toBe(2);
      let expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek['C']['2016-11-14']).toBe(1);

      state = reducer(state, updateScore(childId, '2016-11-13', 'B', 0));
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
      expect(state[childId].child.totalScore).toBe(1);
      expect(state[childId].child).toEqual(initState[childId].child);
      expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek['B']['2016-11-13']).toBe(0);
    });

    it('test delete child', () => {
      const childId1 = uuid.v4();
      const childId2 = uuid.v4();
      const childId3 = uuid.v4();
      const initState = {
        [childId1]: new ChildStateBuilder()
          .withChild(childId1, 'Child1', 'F')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build(),
        [childId2]: new ChildStateBuilder()
          .withChild(childId2, 'Child2', 'M')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-15', 'C', 1)
          .build(),
        [childId3]: new ChildStateBuilder()
          .withChild(childId3, 'Child2', 'M')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-15', 'C', 1)
          .build()
      };
      const state: ChildrenState = reducer(initState, deleteChild(childId2));
      expect(state).toBeTruthy();
      expect(state.isNotLoaded).toBeUndefined();
      expect(Object.keys(state).length).toBe(2);
      expect(state[childId2]).toBeUndefined();
      expect(state[childId1]).toEqual(initState[childId1]);
      expect(state[childId3]).toEqual(initState[childId3]);
    });

    it('test clear token', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', 'F')
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      const state: ChildrenState = reducer(initState, clearToken());
      expect(state).toBeTruthy();
      expect(state).toEqual({ isNotLoaded: true });
    });
  });
});


class ScoreResultBuilder {

  child: Child;
  weeklyScores: WeeklyScore[];

  constructor() {
    this.child = {
      id: uuid.v4(),
      name: 'child-name',
      gender: 'F',
      totalScore: 0
    };
    this.weeklyScores = [];
  }
  build(): ScoreResult {
    return { child: this.child, weeklyScores: this.weeklyScores };
  }
  withChild(id: string, name: string, gender: Gender) {
    this.child.id = id;
    this.child.name = name;
    this.child.gender = gender;
    return this;
  }
  withWeek(week: string, tasks: string[]) {
    this.weeklyScores.push({
      week: week,
      tasks: tasks,
      scores: []
    });
    return this;
  }
  withScore(date: string, task: string, value: number) {
    const week: Date = new Date(moment(Date.parse(date)).utc().day(0).format('YYYY-MM-DD'));
    const weekScore = this.weeklyScores.find((w: WeeklyScore) => w.week === week);
    if (weekScore) {
      weekScore.scores.push({
        date: date,
        task: task,
        value: value
      });
      this.child.totalScore += value;
    }
    return this;
  }
}

class ChildStateBuilder {

  child: Child;
  weeklyScores: WeeklyScoresState;

  constructor() {
    this.child = {
      id: uuid.v4(),
      name: 'child-name',
      gender: 'F',
      totalScore: 0
    };
    this.weeklyScores = {};
  }
  build(): ChildState {
    return { child: this.child, weeklyScores: this.weeklyScores };
  }
  withChild(id: string, name: string, gender: Gender) {
    this.child.id = id;
    this.child.name = name;
    this.child.gender = gender;
    return this;
  }
  withWeek(week: string, tasks: string[]) {
    this.weeklyScores[week] = tasks.reduce((prev: WeeklySectionState, curr: string) => {
      prev[curr] = {};
      return prev;
    }, {});
    return this;
  }
  withScore(date: string, task: string, value: number) {
    const week: string = moment(Date.parse(date)).utc().day(0).format('YYYY-MM-DD');
    this.weeklyScores[week][task][date] = value;
    this.child.totalScore += value;
    return this;
  }
}


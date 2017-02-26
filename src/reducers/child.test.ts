import moment from 'moment';
import * as uuid from 'uuid';

import { clearToken } from '../actions/auth';
import { addChildren, addRedeems, deleteChild, updateChild, updateScore } from '../actions/child';
import * as Constants from '../constants';
import { Child, Gender, Redeem, ScoreResult, WeeklyScore } from '../types/api';
import { ChildrenState, ChildState, WeeklyScoresState, WeeklyState } from '../types/states';
import reducer from './child';

describe('reducers', () => {
  describe('child', () => {
    it('test no child', () => {
      const initState = {};
      const state: ChildrenState = reducer(initState, addChildren([]));
      expect(state).toBeTruthy();
    });

    it('test add children', () => {
      const initState = {};
      const state: ChildrenState = reducer(initState, addChildren([
        { id: uuid.v4(), name: 'C1', gender: Constants.GENDER_MALE, totalScore: 0 },
        { id: uuid.v4(), name: 'C2', gender: Constants.GENDER_FEMALE, totalScore: 0 }
      ]));
      expect(state).toBeTruthy();
      expect(Object.keys(state).filter(k => state[k].isCurrent).length).toBe(1);
      expect(Object.keys(state).length).toBe(2);
    });

    it('test add 1st child', () => {
      const initState = {};
      const childId = uuid.v4();
      const scoreResult = new ScoreResultBuilder()
        .withChild(childId, 'Child1', Constants.GENDER_FEMALE)
        .withWeek('2016-11-13', ['A', 'B', 'C'])
        .build();
      const state: ChildrenState = reducer(initState, updateChild(scoreResult));
      expect(state).toBeTruthy();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].isCurrent).toBeTruthy();
      expect(state[childId].child).toEqual(scoreResult.child);
      const expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['A', 'B', 'C']);
      expect(Object.keys(expectWeek).map(k => expectWeek[k])).toEqual([{}, {}, {}]);
    });

    it('test add 2nd child', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withCurrent()
          .withChild(childId, 'Child1', Constants.GENDER_MALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      const childId2 = uuid.v4();
      const scoreResult = new ScoreResultBuilder()
        .withChild(childId2, 'Child2', Constants.GENDER_FEMALE)
        .withWeek('2016-11-13', ['B', 'C', 'D'])
        .withScore('2016-11-14', 'B', 1)
        .withScore('2016-11-15', 'C', 1)
        .build();
      const state: ChildrenState = reducer(initState, updateChild(scoreResult));
      expect(state).toBeTruthy();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].isCurrent).toBeFalsy();
      expect(state[childId].child).toEqual(initState[childId].child);
      let expectWeek = state[childId].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['A', 'B', 'C']);

      expect(state[childId2]).toBeTruthy();
      expect(state[childId2].isCurrent).toBeTruthy();
      expect(state[childId2].child).toEqual(scoreResult.child);
      expectWeek = state[childId2].weeklyScores['2016-11-13'];
      expect(expectWeek).toBeTruthy();
      expect(Object.keys(expectWeek)).toEqual(['B', 'C', 'D']);
    });
    it('test switch child', () => {
      //todo:
    });
    it('test update child', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', Constants.GENDER_MALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'A', 1)
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      const scoreResult = new ScoreResultBuilder()
        .withChild(childId, 'Child2', Constants.GENDER_FEMALE)
        .withWeek('2016-11-13', ['B', 'C', 'D'])
        .withScore('2016-11-13', 'B', 1)
        .withScore('2016-11-13', 'C', 1)
        .withScore('2016-11-15', 'D', 1)
        .build();
      const state: ChildrenState = reducer(initState, updateChild(scoreResult));
      expect(state).toBeTruthy();
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
          .withChild(childId, 'Child1', Constants.GENDER_MALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      let state: ChildrenState = reducer(initState, updateScore(childId, '2016-11-14', 'C', 1));
      expect(state).toBeTruthy();
      expect(state[childId]).toBeTruthy();
      expect(state[childId].child.totalScore).toBe(2);
      let expectWeek = state[childId].weeklyScores['2016-11-13'];
      // tslint:disable-next-line:no-string-literal
      expect(expectWeek['C']['2016-11-14']).toBe(1);

      state = reducer(state, updateScore(childId, '2016-11-13', 'B', 0));
      expect(state).toBeTruthy();
      expect(state[childId].child.totalScore).toBe(1);
      expect(state[childId].child).toEqual(initState[childId].child);
      expectWeek = state[childId].weeklyScores['2016-11-13'];
      // tslint:disable-next-line:no-string-literal
      expect(expectWeek['B']['2016-11-13']).toBe(0);
    });

    it('test delete child', () => {
      const childId1 = uuid.v4();
      const childId2 = uuid.v4();
      const childId3 = uuid.v4();
      const initState = {
        [childId1]: new ChildStateBuilder()
          .withChild(childId1, 'Child1', Constants.GENDER_FEMALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build(),
        [childId2]: new ChildStateBuilder()
          .withCurrent()
          .withChild(childId2, 'Child2', Constants.GENDER_MALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-15', 'C', 1)
          .build(),
        [childId3]: new ChildStateBuilder()
          .withChild(childId3, 'Child2', Constants.GENDER_MALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-15', 'C', 1)
          .build()
      };
      const state: ChildrenState = reducer(initState, deleteChild(childId2));
      expect(state).toBeTruthy();
      expect(Object.keys(state).length).toBe(2);
      expect(state[childId2]).toBeUndefined();
      expect(Object.keys(state).filter(k => state[k].isCurrent).length).toBe(1);
    });

    it('test clear token', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', Constants.GENDER_FEMALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 1)
          .build()
      };
      const state: ChildrenState = reducer(initState, clearToken());
      expect(state).toBeTruthy();
    });

    it('test create redeem', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', Constants.GENDER_FEMALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 10)
          .withRedeem('2017-01-01T05:00:00Z', 'x', 1)
          .withRedeem('2017-01-01T01:00:00Z', 'y', 1)
          .build()
      };

      const state: ChildrenState = reducer(initState, addRedeems(
        childId,
        [{ timestamp: '2017-01-01T06:00:00Z', description: 'x', value: 1 }],
        true));

      expect(state).toBeTruthy();
      expect(state[childId].child.totalScore).toBe(9);
      expect(state[childId].redeems.length).toBe(3);
    });

    it('test add redeems', () => {
      const childId = uuid.v4();
      const initState = {
        [childId]: new ChildStateBuilder()
          .withChild(childId, 'Child1', Constants.GENDER_FEMALE)
          .withWeek('2016-11-13', ['A', 'B', 'C'])
          .withScore('2016-11-13', 'B', 10)
          .withRedeem('2017-01-01T05:00:00Z', 'x', 1)
          .withRedeem('2017-01-01T01:00:00Z', 'y', 1)
          .build()
      };

      const state: ChildrenState = reducer(initState, addRedeems(
        childId,
        [
          { timestamp: '2017-01-01T03:00:00Z', description: 'x', value: 1 },
          { timestamp: '2017-01-01T04:00:00Z', description: 'x', value: 1 },
          { timestamp: '2017-01-01T02:00:00Z', description: 'x', value: 1 }
        ],
        false));

      expect(state).toBeTruthy();
      expect(state[childId].child.totalScore).toBe(10);
      expect(state[childId].redeems.length).toBe(5);
      expect(state[childId].redeems[0].timestamp).toBe('2017-01-01T05:00:00Z');
      expect(state[childId].redeems[1].timestamp).toBe('2017-01-01T04:00:00Z');
      expect(state[childId].redeems[2].timestamp).toBe('2017-01-01T03:00:00Z');
      expect(state[childId].redeems[3].timestamp).toBe('2017-01-01T02:00:00Z');
      expect(state[childId].redeems[4].timestamp).toBe('2017-01-01T01:00:00Z');
    });

  });
});

class ScoreResultBuilder {

  private child: Child;
  private weeklyScores: Array<WeeklyScore>;

  constructor() {
    this.child = {
      id: uuid.v4(),
      name: 'child-name',
      gender: Constants.GENDER_FEMALE,
      totalScore: 0
    };
    this.weeklyScores = [];
  }
  public build(): ScoreResult {
    return { child: this.child, weeklyScores: this.weeklyScores };
  }
  public withChild(id: string, name: string, gender: Gender) {
    this.child.id = id;
    this.child.name = name;
    this.child.gender = gender;
    return this;
  }
  public withWeek(week: string, tasks: Array<string>) {
    this.weeklyScores.push({
      week,
      tasks,
      scores: []
    });
    return this;
  }
  public withScore(date: string, task: string, value: number) {
    const week = moment(date).day(0).format(Constants.DATE_FORMAT);
    const weekScore = this.weeklyScores.find((w: WeeklyScore) => w.week === week);
    if (weekScore) {
      weekScore.scores.push({
        date,
        task,
        value
      });
      this.child.totalScore += value;
    }
    return this;
  }
}

class ChildStateBuilder {

  private isCurrent: boolean;
  private child: Child;
  private weeklyScores: WeeklyScoresState;
  private redeems: Array<Redeem>;

  constructor() {
    this.isCurrent = true;
    this.child = {
      id: uuid.v4(),
      name: 'child-name',
      gender: Constants.GENDER_FEMALE,
      totalScore: 0
    };
    this.weeklyScores = {};
    this.redeems = [];
  }
  public build(): ChildState {
    return {
      isCurrent: this.isCurrent,
      child: this.child,
      weeklyScores: this.weeklyScores,
      redeems: this.redeems
    };
  }
  public withCurrent() {
    this.isCurrent = true;
    return this;
  }
  public withChild(id: string, name: string, gender: Gender) {
    this.child.id = id;
    this.child.name = name;
    this.child.gender = gender;
    return this;
  }
  public withWeek(week: string, tasks: Array<string>) {
    this.weeklyScores[week] = tasks.reduce(
      (prev: WeeklyState, curr: string) => {
        prev[curr] = {};
        return prev;
      },
      {});
    return this;
  }
  public withScore(date: string, task: string, value: number) {
    const week: string = moment(date).day(0).format(Constants.DATE_FORMAT);
    this.weeklyScores[week][task][date] = value;
    this.child.totalScore += value;
    return this;
  }
  public withRedeem(timestamp: string, description: string, value: number) {
    this.redeems.push({ timestamp, description, value });
    return this;
  }
}

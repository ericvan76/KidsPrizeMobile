import moment from 'moment';
import * as uuid from 'uuid';

import { DATE_FORMAT, GENDER_FEMALE } from '../constants';
import { Child, Gender, Redeem } from '../types/api';
import { ChildState, ScoresState, TaskRow, WeeklyState } from '../types/states';

export default class ChildStateBuilder {

  private isCurrent: boolean;
  private child: Child;
  private scores: ScoresState;
  private redeems: Array<Redeem>;

  constructor() {
    this.isCurrent = false;
    this.child = {
      id: uuid.v4(),
      name: 'child-name',
      gender: GENDER_FEMALE,
      totalScore: 0
    };
    this.scores = new Map<string, WeeklyState>();
    this.redeems = [];
  }
  public build(): ChildState {
    return {
      isCurrent: this.isCurrent,
      child: this.child,
      scores: this.scores,
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
    this.scores.set(
      week,
      new Map(tasks.map(t => [t, []] as [string, TaskRow]))
    );
    return this;
  }
  public withScore(date: string, task: string, value: number) {
    const week = moment(date).day(0).format(DATE_FORMAT);
    const targetWeek = this.scores.get(week);
    if (targetWeek) {
      const targetTaskRow = targetWeek.get(task);
      if (targetTaskRow) {
        targetTaskRow.push({ task, date, value });
        this.child.totalScore += value;
      }
    }
    return this;
  }
  public withRedeem(timestamp: string, description: string, value: number) {
    this.redeems.push({ timestamp, description, value });
    return this;
  }
}

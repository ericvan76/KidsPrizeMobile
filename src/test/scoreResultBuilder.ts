import moment from 'moment';
import * as uuid from 'uuid';

import { DATE_FORMAT, GENDER_FEMALE } from '../constants';
import { Child, Gender, ScoreResult, WeeklyScore } from '../types/api';

export default class ScoreResultBuilder {

  private child: Child;
  private weeklyScores: Array<WeeklyScore>;

  constructor() {
    this.child = {
      id: uuid.v4(),
      name: 'child-name',
      gender: GENDER_FEMALE,
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
    const week = moment(date).day(0).format(DATE_FORMAT);
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

/* @flow */
/* eslint no-undef: off */

declare type Child = {
  id: string,
  name: string,
  gender: 'M' | 'F',
  totalScore: number,
}

declare type Score = {
  date: Date,
  task: string,
  value: number,
}

declare type TaskGroup = {
  effectiveDate: Date,
  tasks: string[],
}

declare type ScoreResult = {
  child: Child,
  scores: Score[],
  taskGroups: TaskGroup[],
}


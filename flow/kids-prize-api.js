/* @flow */
/* eslint no-undef: off */

// Preference
declare type Preference = {
  timeZoneOffset: number
};

// Child & Score
declare type Gender = 'M' | 'F';

declare type Child = {
  id: string,
  name: string,
  gender: Gender,
  totalScore: number,
};

declare type ScoreResult = {
  child: Child,
  weeklyScores: WeeklyScore[]
};

declare type WeeklyScore = {
  week: string,
  tasks: string[],
  scores: Score[]
};

declare type Score = {
  date: string,
  task: string,
  value: number
};

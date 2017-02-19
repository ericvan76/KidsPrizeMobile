/* @flow */
/* eslint no-undef: off */

// Preference
export type Preference = {
  timeZoneOffset: number
};

// Child & Score
export type Gender = 'M' | 'F';

export type Child = {
  id: string,
  name: string,
  gender: Gender,
  totalScore: number,
};

export type ScoreResult = {
  child: Child,
  weeklyScores: WeeklyScore[]
};

export type WeeklyScore = {
  week: string,
  tasks: string[],
  scores: Score[]
};

export type Score = {
  date: string,
  task: string,
  value: number
};

export type Redeem = {
  timestamp: string,
  description: string,
  value: number
};
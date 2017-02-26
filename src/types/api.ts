import * as Constants from '../constants';

// Preference
export interface Preference {
  timeZoneOffset: number;
}

export type Gender = typeof Constants.GENDER_MALE | typeof Constants.GENDER_FEMALE;

export interface Child {
  id: string;
  name: string;
  gender: Gender;
  totalScore: number;
}

export interface ScoreResult {
  child: Child;
  weeklyScores: Array<WeeklyScore>;
}

export interface WeeklyScore {
  week: string;
  tasks: Array<string>;
  scores: Array<Score>;
}

export interface Score {
  date: string;
  task: string;
  value: number;
}

export interface Redeem {
  timestamp: string;
  description: string;
  value: number;
}

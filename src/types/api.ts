import { GENDER_FEMALE, GENDER_MALE } from '../constants';

// Preference
export interface Preference {
  timeZoneOffset: number;
}

export type Gender = typeof GENDER_MALE | typeof GENDER_FEMALE;

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

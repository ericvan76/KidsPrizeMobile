import { Child, Redeem } from './api';
import { Profile, Token } from './auth';

export interface AppState {
  auth: AuthState;
  children: ChildrenState;
  errors: Array<Error>;
}

export interface AuthState {
  tokenLoaded: boolean;
  token?: Token;
  profile?: Profile;
}

export interface ChildrenState {
  [id: string]: ChildState;
}

export interface ChildState {
  isCurrent: boolean;
  child: Child;
  weeklyScores: WeeklyScoresState;
  redeems: Array<Redeem>;
}

export interface WeeklyScoresState {
  [week: string]: WeeklyState;
}

export interface WeeklyState {
  [task: string]: TaskRowState;
}

export interface TaskRowState {
  [date: string]: number;
}

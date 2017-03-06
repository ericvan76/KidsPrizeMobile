import { Child, Redeem, Score } from './api';
import { Profile, Token } from './auth';

export interface AppState {
  auth: AuthState;
  initialised: boolean;
  children: ChildrenState;
  errors: Array<Error>;
}

export type ChildrenState = Map<string, ChildState>;

export interface AuthState {
  tokenLoadCompleted: boolean;
  token?: Token;
  profile?: Profile;
}

export interface ChildState {
  isCurrent: boolean;
  child: Child;
  scores: ScoresState;
  redeems: Array<Redeem>;
}

export type ScoresState = Map<string, WeeklyState>;

export type WeeklyState = Map<string, TaskRow>;

export type TaskRow = Array<Score>;

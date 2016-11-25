/* @flow */

export type AppState = {
  auth: AuthState,
  currentChild: ?string,
  children: ChildrenState,
  form: {
    childForm: any
  },
  errors: Error[]
};

export type AuthState = {
  initialised: boolean,
  discovery: ?Discovery,
  token: ?Token,
  user: ?User
};

export type ChildrenState = {
  isNotLoaded?: boolean,
  [id: string]: ChildState
};

export type ChildState = {
  child: Child,
  weeklyScores: WeeklyScoresState
};

export type WeeklyScoresState = {
  [week: string]: WeeklySectionState
};

export type WeeklySectionState = {
  [task: string]: TaskRowState
};

export type TaskRowState = {
  [date: string]: number
};
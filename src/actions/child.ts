import {
  Child,
  ChildId,
  Gender,
  Redeem,
  ScoreResult
} from 'src/api/child';
import { createAction } from './action';

// Store actions
export const updateChild = createAction<'kidsprize/child/updateChild', Child>(
  'kidsprize/child/updateChild'
);

export const removeChild = createAction<'kidsprize/child/removeChild', ChildId>(
  'kidsprize/child/removeChild'
);

export const switchChild = createAction<'kidsprize/child/switchChild', ChildId | null>(
  'kidsprize/child/switchChild'
);

export const updateScores = createAction<'kidsprize/child/updateScores', ScoreResult>(
  'kidsprize/child/updateScores'
);

export interface UpdateRedeemsPayload {
  child: Child;
  redeems: Redeem[];
}
export const updateRedeems = createAction<'kidsprize/child/updateRedeems', UpdateRedeemsPayload>(
  'kidsprize/child/updateRedeems'
);

export const reset = createAction<'kidsprize/child/reset'>(
  'kidsprize/child/reset'
);

// Saga actions
export const fetchChildren = createAction<'kidsprize/child/fetchChildren'>(
  'kidsprize/child/fetchChildren'
);

export const refreshScores = createAction<'kidsprize/child/refreshScores', ChildId>(
  'kidsprize/child/refreshScores'
);

export const fetchMoreStores = createAction<'kidsprize/child/fetchMoreStores', ChildId>(
  'kidsprize/child/fetchMoreStores'
);

export interface CreateChildPayload {
  childId: ChildId;
  name: string;
  gender: Gender;
  tasks: string[];
}
export const createChild = createAction<'kidsprize/child/createChild', CreateChildPayload>(
  'kidsprize/child/createChild'
);
export interface EditChildPayload {
  childId: ChildId;
  name?: string;
  gender?: Gender;
  tasks?: string[];
}
export const modifyChild = createAction<'kidsprize/child/modifyChild', EditChildPayload>(
  'kidsprize/child/modifyChild'
);

export const deleteChild = createAction<'kidsprize/child/deleteChild', ChildId>(
  'kidsprize/child/deleteChild'
);

export interface SetScorePayload {
  childId: ChildId;
  date: string;
  task: string;
  value: number;
}
export const setScore = createAction<'kidsprize/child/setScore', SetScorePayload>(
  'kidsprize/child/setScore'
);

export interface CreateRedeemPayload {
  childId: ChildId;
  description: string;
  value: number;
}
export const createRedeem = createAction<'kidsprize/child/createRedeem', CreateRedeemPayload>(
  'kidsprize/child/createRedeem'
);

export const refreshRedeems = createAction<'kidsprize/child/refreshRedeems', ChildId>(
  'kidsprize/child/refreshRedeems'
);

export const fetchMoreRedeems = createAction<'kidsprize/child/fetchMoreRedeems', ChildId>(
  'kidsprize/child/fetchMoreRedeems'
);

/* @flow */

import type { Token } from '../types/auth.flow';

export type Action<Type, Payload> = {
  type: Type,
  payload: Payload
};

export type InitialisedPayload = {
  token: ?Token
};

export type UpdateScorePayload = {
  childId: string,
  date: string,
  task: string,
  value: number
};
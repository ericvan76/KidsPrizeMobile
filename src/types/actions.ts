import { Action as BaseAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Redeem } from './api';
import { Token } from './auth';
import { AppState } from './states';

export interface Action<Type extends string, Payload> extends BaseAction {
  // tslint:disable-next-line:no-reserved-keywords type is the accepted Action discriminator in redux actions
  type: Type;
  payload: Payload;
}

// tslint:disable-next-line:no-any
export type AsyncAction = ThunkAction<any, AppState, any>;

export interface InitialisedPayload {
  token?: Token;
}

export interface UpdateScorePayload {
  childId: string;
  date: string;
  task: string;
  value: number;
}

export interface AddRedeemsPayload {
  childId: string;
  redeems: Array<Redeem>;
  updateTotal: boolean;
}

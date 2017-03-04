import { Action as BaseAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Redeem } from './api';
import { AppState } from './states';

export type BaseAction = BaseAction;

export interface Action<Type extends string, Payload> extends BaseAction {
  // tslint:disable-next-line:no-reserved-keywords type is the accepted Action discriminator in redux actions
  type: Type;
  payload: Payload;
}

export type AsyncAction = ThunkAction<void, AppState, {}>;

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

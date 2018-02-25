import { createAction } from './action';

export const startRequesting = createAction<'kidsprize/requestState/startRequesting', string>(
  'kidsprize/requestState/startRequesting'
);

export const endRequesting = createAction<'kidsprize/requestState/endRequesting', string>(
  'kidsprize/requestState/endRequesting'
);

export const requestFailure = createAction<'kidsprize/requestState/requestFailure', { actionType: string; error: Error }>(
  'kidsprize/requestState/requestFailure'
);

export const clearErrors = createAction<'kidsprize/requestState/clearErrors'>(
  'kidsprize/requestState/clearErrors'
);

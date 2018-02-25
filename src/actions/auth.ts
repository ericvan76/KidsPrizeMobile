import { Profile } from 'src/api/auth';
import { createAction } from './action';

export const updateProfile = createAction<'kidsprize/auth/updateProfile', Profile | undefined>(
  'kidsprize/auth/updateProfile'
);

export const signIn = createAction<'kidsprize/auth/signIn'>(
  'kidsprize/auth/signIn'
);

export const signOut = createAction<'kidsprize/auth/signOut'>(
  'kidsprize/auth/signOut'
);

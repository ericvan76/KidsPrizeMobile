/* @flow */

export type Token = {
  id_token: string,
  expires_in: number,
  token_type: string,
  refresh_token: string,
  expires_at: Date
};

export type Profile = {
  email: string,
  given_name: string,
  family_name: string,
  name: string,
  nickname?: string,
  picture?: string,
  sub: string
};
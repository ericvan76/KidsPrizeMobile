/* @flow */

export type Token = {
  access_token: string,
  id_token: string,
  expires_in: number,
  token_type: string,
  refresh_token: string
};

export type Profile = {
  email: string,
  email_verified: bool,
  given_name?: string,
  family_name?: string,
  name?: string,
  nickname?: string,
  picture?: string,
  iss: string,
  aud: string,
  sub: string,
  exp: number,
  iat: number
};
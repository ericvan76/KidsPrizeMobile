/* @flow */
/* eslint no-undef: off */

// Auth
declare type Discovery = {
  issuer: string,
  jwks_uri: string,
  authorization_endpoint: string,
  token_endpoint: string,
  userinfo_endpoint: string,
  end_session_endpoint: string,
  check_session_iframe: string,
  revocation_endpoint: string,
  introspection_endpoint: string,
  frontchannel_logout_supported: boolean,
  frontchannel_logout_session_supported: boolean,
  scopes_supported: string[],
  claims_supported: string[],
  response_types_supported: string[],
  response_modes_supported: string[],
  grant_types_supported: string[],
  subject_types_supported: string[],
  id_token_signing_alg_values_supported: string[],
  token_endpoint_auth_methods_supported: string[],
  code_challenge_methods_supported: string[]
};

declare type Token = {
  access_token: string,
  id_token?: string,
  expires_in: number,
  token_type: string,
  refresh_token?: string,
  expires_at: Date
};

declare type User = {
  given_name: string,
  family_name: string,
  name: string,
  sub: string
};

// Preference
declare type Preference = {
  timeZoneOffset: number
};

// Child & Score
declare type Gender = 'M' | 'F';

declare type Child = {
  id: string,
  name: string,
  gender: Gender,
  totalScore: number,
};

declare type ScoreResult = {
  child: Child,
  weeklyScores: WeeklyScore[]
};

declare type WeeklyScore = {
  week: string,
  tasks: string[],
  scores: Score[]
};

declare type Score = {
  date: string,
  task: string,
  value: number
};

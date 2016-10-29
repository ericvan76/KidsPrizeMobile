/* @flow */

export type AuthConfig = {
  authority: string,
  response_type: string,
  scope: string,
  client_id: string,
  client_secret: string,
  redirect_uri: string
};

export type ApiConfig = {
  baseUrl: string
};

export type Config = {
  auth: AuthConfig,
  api: ApiConfig
};
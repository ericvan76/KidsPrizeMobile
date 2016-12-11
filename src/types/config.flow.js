/* @flow */

export type AuthConfig = {
  auth0_domain: string,
  client_id: string,
  client_secret: string
};

export type ApiConfig = {
  baseUrl: string
};

export type Config = {
  auth: AuthConfig,
  api: ApiConfig
};
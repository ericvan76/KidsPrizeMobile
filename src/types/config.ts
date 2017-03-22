export interface AuthConfig {
  auth0_domain: string;
  client_id: string;
  client_secret: string;
}

export interface ApiConfig {
  baseUrl: string;
}

export interface Config {
  auth: AuthConfig;
  api: ApiConfig;
}

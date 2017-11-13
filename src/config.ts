import { Config } from './types/config';

const config: Config = {
  auth: {
    auth0_domain: 'AUTH0_DOMAIN',
    client_id: 'AUTH0_CLIENT_ID',
    client_secret: 'AUTH0_CLIENT_SECRET'
  },
  api: {
    baseUrl: 'https://kidsprize-api.fanstek.com/v2'
  }
};

export default config;

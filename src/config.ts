import { Config } from './types/config';

const config: Config = {
  auth: {
    auth0_domain: '<auth0_domain>',
    client_id: '<client_id>',
    client_secret: '<client_Secret>'
  },
  api: {
    baseUrl: 'https://api.kids-prize.com/v2'
  }
};

export default config;

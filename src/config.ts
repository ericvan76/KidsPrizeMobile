import { Constants } from 'expo';

interface Config {
  semver: string;
  apiEndpoint: string;
  auth0Domain: string;
  auth0ClientId: string;
  auth0ClientSecret: string;
}

export const CONFIG = Constants.manifest.extra as Config;

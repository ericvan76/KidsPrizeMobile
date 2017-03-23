#!/bin/bash
set -e

# generate config file
mkdir -p ./src/__config__/
cat > ./src/__config__/index.ts << EOF
import { Config } from '../types/config';

const config: Config = {
  auth: {
    auth0_domain: 'apperic.auth0.com',
    client_id: '$AUTH0_CLIENT_ID',
    client_secret: '$AUTH0_CLIENT_SECRET'
  },
  api: {
    baseUrl: 'https://api.kids-prize.com'
  }
};

export default config;
EOF

# javascript
$yarn typecheck
$yarn tslint
$yarn test
$yarn build

# todo: ios build steps



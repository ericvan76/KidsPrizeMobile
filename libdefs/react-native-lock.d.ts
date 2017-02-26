declare module 'react-native-lock' {

  interface Config {
    clientId: string;
    domain: string;
  }

  interface AuthParams {
    scope: string;
    device: string;
  }

  class Auth0Lock {
    constructor(config: Config);
    show(options: { authParams: AuthParams }, callback: (err: any, profile: any, token: any) => void): void;
  }

  export default Auth0Lock;

}
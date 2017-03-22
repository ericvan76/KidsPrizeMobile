declare module 'react-native-lock' {

  interface Config {
    clientId: string;
    domain: string;
  }

  interface AuthParams {
    scope: string;
    device: string;
  }

  interface Token {
    idToken: string;
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  class Auth0Lock {
    constructor(config: Config);
    show(options: { authParams: AuthParams }, callback: (err: Error | undefined, profile: any, token: Token) => void): void;
  }

  export default Auth0Lock;

}

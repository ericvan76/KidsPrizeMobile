import moment from 'moment';
import { AsyncStorage } from 'react-native';
import {
  authorizeAsync,
  decodeJwt,
  logoutAsync,
  obtainTokenAsync,
  Profile,
  refreshTokenAsync,
  revokeRefreshTokenAsync,
  Token
} from './auth';

const TOKEN_STORAGE_KEY: string = 'kidsprize_v2_token';
const FINGER_PRINT_ENABLED_KEY: string = 'fingerprint_enabled';

class AuthClient {

  private static instance: AuthClient;
  private token: Token | undefined;

  private constructor() {
    // singleton protect
  }

  public static getInstance(): AuthClient {
    if (this.instance === undefined) {
      this.instance = new AuthClient();
    }
    return this.instance;
  }

  public signInAsync = async (): Promise<Profile | undefined> => {
    let token = await this.loadTokenFromStorageAsync();
    let profile = this.parseToken(token);
    if (profile) {
      this.token = token;
      return profile;
    }
    // no stored token, authorise
    const authCode = await authorizeAsync();
    if (authCode === undefined) {
      return undefined;
    }
    token = await obtainTokenAsync(authCode);
    profile = this.parseToken(token);
    if (profile) {
      this.token = token;
      if (token.refresh_token) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
        // await this.askEnableFingerprintAsync();
      }
      return profile;
    }
    throw new Error('SignIn Failure.');
  };

  public signOutAsync = async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(FINGER_PRINT_ENABLED_KEY);
    if (this.token && this.token.refresh_token) {
      await revokeRefreshTokenAsync(this.token.refresh_token);
    }
    await logoutAsync();
  };

  public getAuthTokenAsync = async (): Promise<string> => {
    try {
      if (this.token) {
        const decoded = decodeJwt(this.token.id_token);
        if (moment()
          .add(5, 'minutes')
          .isBefore(moment(decoded.exp * 1000))) {
          return this.token.id_token;
        }
        if (this.token.refresh_token) {
          const token = await refreshTokenAsync(this.token.refresh_token);
          // set refresh_token to new token, which doesn't contain it.
          token.refresh_token = this.token.refresh_token;
          this.token = token;
          await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
          return this.token.id_token;
        }
      }
      throw new Error('Failed to get AuthToken.');
    } catch (e) {
      // clean up
      this.token = undefined;
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      throw e;
    }
  };

  private readonly parseToken = (token: Token | undefined): Profile | undefined => {
    if (token && token.id_token) {
      return decodeJwt(token.id_token);
    }
    return undefined;
  };

  // private readonly askEnableFingerprintAsync = async (): Promise<void> => {
  //   if (await hasFingerprintEnrolledAsync()) {
  //     Alert.alert(
  //       Platform.OS === 'ios' ? 'Enable Touch ID?' : 'Enable Fingerprint?',
  //       'You can change this setting by sign out and sign in again.',
  //       [
  //         { text: 'No', onPress: async () => { await AsyncStorage.removeItem(FINGER_PRINT_ENABLED_KEY); }, style: 'cancel' },
  //         { text: 'Yes', onPress: async () => { await AsyncStorage.setItem(FINGER_PRINT_ENABLED_KEY, '1'); } }
  //       ],
  //       { cancelable: false }
  //     );
  //   } else {
  //     await AsyncStorage.removeItem(FINGER_PRINT_ENABLED_KEY);
  //   }
  // }

  private readonly loadTokenFromStorageAsync = async (): Promise<Token | undefined> => {
    const value: string | undefined = await AsyncStorage.getItem(TOKEN_STORAGE_KEY) || undefined;
    if (value !== undefined) {
      return JSON.parse(value) as Token;
      // const fingerprintEnabled: string | undefined = await AsyncStorage.getItem(FINGER_PRINT_ENABLED_KEY) || undefined;
      // if (fingerprintEnabled === undefined) {
      //   // fingerprint disabled, return token
      //   return token;
      // }
      // if (await validateFingerprintAsync()) {
      //   return token;
      // }
    }
    return undefined;
  };
}

export const authClient = AuthClient.getInstance();

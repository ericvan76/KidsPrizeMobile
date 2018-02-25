import { Fingerprint } from 'expo';
import moment from 'moment';
import { Alert, AsyncStorage, Platform } from 'react-native';
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

  private constructor() { }

  public static getInstance(): AuthClient {
    if (this.instance === undefined) {
      this.instance = new AuthClient();
    }
    return this.instance;
  }

  public signInAsync = async (): Promise<Profile> => {
    let token = await this.loadTokenFromStorageAsync();
    let profile = this.parseToken(token);
    if (profile) {
      this.token = token;
      return profile;
    }
    // no stored token, authorise
    const authCode = await authorizeAsync();
    token = await obtainTokenAsync(authCode);
    profile = this.parseToken(token);
    if (profile) {
      this.token = token;
      if (token.refresh_token) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
        await this.askEnableFingerprintAsync();
      }
      return profile;
    }
    throw new Error('Login Failure.');
  }

  public signOutAsync = async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(FINGER_PRINT_ENABLED_KEY);
    if (this.token && this.token.refresh_token) {
      await revokeRefreshTokenAsync(this.token.refresh_token);
    }
    await logoutAsync();
  }

  public getAuthTokenAsync = async (): Promise<string> => {
    if (this.token) {
      const decoded = decodeJwt(this.token.id_token);
      if (moment().add(5, 'minutes').isBefore(moment(decoded.exp * 1000))) {
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
    // clean up
    this.token = undefined;
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    throw new Error('Failed to get AuthToken.');
  }

  private parseToken = (token: Token | undefined): Profile | undefined => {
    if (token && token.id_token) {
      return decodeJwt(token.id_token);
    }
    return undefined;
  }

  private askEnableFingerprintAsync = async (): Promise<void> => {
    const hasHardware = await Fingerprint.hasHardwareAsync();
    const enrolled = await Fingerprint.isEnrolledAsync();
    if (hasHardware && enrolled) {
      Alert.alert(
        Platform.OS === 'ios' ? 'Enable Touch ID?' : 'Enable Fingerprint?',
        'You can change this by re-login later.',
        [
          { text: 'No', onPress: async () => { await AsyncStorage.removeItem(FINGER_PRINT_ENABLED_KEY); }, style: 'cancel' },
          { text: 'Yes', onPress: async () => { await AsyncStorage.setItem(FINGER_PRINT_ENABLED_KEY, 'true'); } }
        ],
        { cancelable: false }
      );
    } else {
      await AsyncStorage.removeItem(FINGER_PRINT_ENABLED_KEY);
    }
  }

  private loadTokenFromStorageAsync = async (): Promise<Token | undefined> => {
    const value: string = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (value !== undefined) {
      const token = JSON.parse(value) as Token;
      const fingerprintEnabled: string = await AsyncStorage.getItem(FINGER_PRINT_ENABLED_KEY);
      if (!fingerprintEnabled) {
        // fingerprint disabled, return token
        return token;
      }
      const hasHardware = await Fingerprint.hasHardwareAsync();
      const enrolled = await Fingerprint.isEnrolledAsync();
      if (hasHardware && enrolled) {
        const result: Fingerprint.FingerprintAuthenticationResult = await Fingerprint.authenticateAsync('Use Touch ID to Login');
        if (!result.success) {
          throw new Error(result.error);
        }
        // fingerprint verified, return token
        return token;
      }
    }
    return undefined;
  }
}

export const authClient = AuthClient.getInstance();

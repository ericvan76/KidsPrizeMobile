import RN from 'react-native';
import { Token } from '../types/auth';

const TOKEN = 'token';

export async function saveToken(token: Token) {
  try {
    await RN.AsyncStorage.setItem(TOKEN, JSON.stringify(token));
  } catch (error) {
    RN.Alert.alert('Error', 'Failed to persist token.');
  }
}

export async function loadToken(): Promise<Token | undefined> {
  try {
    const value = await RN.AsyncStorage.getItem(TOKEN);
    return JSON.parse(value) as Token;
  } catch (e) {
    return undefined;
  }
}

export async function clearToken() {
  await RN.AsyncStorage.removeItem(TOKEN);
}

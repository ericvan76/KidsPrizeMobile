/* @flow */

import { AsyncStorage, Alert } from 'react-native';

const TOKEN = 'token';

export async function saveToken(token: Token) {
  try {
    await AsyncStorage.setItem(TOKEN, JSON.stringify(token));
  } catch (error) {
    Alert.alert('Error', 'Failed to persist token.');
  }
}

export async function loadToken(): Promise<?Token> {
  try {
    const value = await AsyncStorage.getItem(TOKEN);
    const token: Token = JSON.parse(value);
    return token;
  } catch (e) {
    return null;
  }
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN);
}

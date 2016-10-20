import { AsyncStorage, Alert } from 'react-native';

const TOKEN = 'token';

const saveToken = async(token) => {
  try {
    await AsyncStorage.setItem(TOKEN, JSON.stringify(token));
  } catch (error) {
    Alert.alert('Error', 'Failed to persist token.');
  }
};

const loadToken = async() => {
  try {
    var value = await AsyncStorage.getItem(TOKEN);
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const clearToken = async() => {
  const token = await loadToken();
  await AsyncStorage.clear();
  return token;
};

export default {
  saveToken,
  loadToken,
  clearToken
};
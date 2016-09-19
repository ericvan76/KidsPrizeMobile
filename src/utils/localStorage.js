import { AsyncStorage, Alert } from 'react-native';

const keys = {
  token: 'token'
};

const setToken = async(token) => {
  try {
    await AsyncStorage.setItem(keys.token, JSON.stringify(token));
  } catch (error) {
    Alert.alert('Error', 'Failed to persist token.');
  }
};

const getToken = async() => {
  try {
    var value = await AsyncStorage.getItem(keys.token);
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const clearToken = async() => {
  const token = await getToken();
  await AsyncStorage.clear();
  return token;
};

export default {
  setToken,
  getToken,
  clearToken
};
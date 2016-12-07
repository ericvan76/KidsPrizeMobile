/* @flow */
import { Alert } from 'react-native';

import store from '../store';
import { resetFailure } from '../actions/failure';

export function alert(errors: Error[]) {
  if (errors.length > 0) {
    Alert.alert(
      'Oops!',
      errors[0].message || 'Unknown Error.',
      [
        { text: 'OK', onPress: () => { store.dispatch(resetFailure()); } }
      ]);
  }
}


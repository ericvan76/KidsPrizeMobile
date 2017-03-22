import RN from 'react-native';
import { resetError } from '../actions/errors';

import store from '../store';

export function alert(errors: Array<Error>) {
  if (errors.length > 0) {
    RN.Alert.alert(
      'Oops!',
      errors[0].message || 'Unknown Error.',
      [
        { text: 'OK', onPress: () => { store.dispatch(resetError()); } }
      ]);
  }
}

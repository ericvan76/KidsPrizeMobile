import RN from 'react-native';
import { resetFailure } from '../actions/failure';

import store from '../store';

export function alert(errors: Array<Error>) {
  if (errors.length > 0) {
    RN.Alert.alert(
      'Oops!',
      errors[0].message || 'Unknown Error.',
      [
        { text: 'OK', onPress: () => { store.dispatch(resetFailure()); } }
      ]);
  }
}

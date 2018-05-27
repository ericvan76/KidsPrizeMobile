import { Alert } from 'react-native';
import { clearErrors } from 'src/actions/requestState';
import { store } from 'src/store';
import { signIn, signOut } from '../actions/auth';

let errorInDisplay: boolean = false;

export function tryDisplayErrors(errors: Record<string, Error>): boolean {
  if (errorInDisplay) {
    return true;
  }
  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    let title: string;
    let message: string;
    if (errorKeys.some(k => k === signIn.type)) {
      title = 'Authentication Error';
      message = 'Please sign in again.';
    } else {
      title = 'Service is not available';
      message = 'We\'re working on this, please try again later.';
    }
    if (__DEV__) {
      const err = errorKeys.reduce(
        (p: Record<string, string>, c: string) => {
          p[c] = errors[c].message;
          return p;
        },
        {});
      title = 'Ooops';
      message = JSON.stringify(err);
    }
    errorInDisplay = true;
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK', onPress: () => {
            errorInDisplay = false;
            store.dispatch(clearErrors(undefined));
            if (errorKeys.some(k => k === signIn.type)) {
              store.dispatch(signOut(undefined));
            }
          }
        }
      ],
      { cancelable: false }
    );
    return true;
  }
  return false;
}

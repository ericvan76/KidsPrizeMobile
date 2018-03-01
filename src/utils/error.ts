import { Alert } from 'react-native';
import { clearErrors } from 'src/actions/requestState';

let errorInDisplay: boolean = false;

export function displayErrors(errors: Record<string, Error>, clearAction: typeof clearErrors): void {
  if (errorInDisplay) {
    return;
  }
  if (Object.keys(errors).length > 0) {
    let message = 'Something went wrong.';
    if (__DEV__) {
      const err = Object.keys(errors).reduce(
        (p: Record<string, string>, c: string) => {
          p[c] = errors[c].message;
          return p;
        },
        {});
      message = JSON.stringify(err);
    }
    errorInDisplay = true;
    Alert.alert(
      'Ooops',
      message,
      [
        {
          text: 'OK', onPress: () => {
            errorInDisplay = false;
            clearAction(undefined);
          }
        }
      ],
      { cancelable: false }
    );
  }
}
